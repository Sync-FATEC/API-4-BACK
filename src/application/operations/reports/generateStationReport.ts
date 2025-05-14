import { jsPDF } from "jspdf";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Station } from "../../../domain/models/entities/Station";
import parseUnixTimeToDate from "../unixTime";
import "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as path from "path";
import * as fs from "fs";
import sizeOf from "image-size";  

type GroupKey = string;

function groupAndAverage(
  measures: { value: number; unixTime: number }[],
  type: "hour" | "day" | "month"
) {
  const groups: Record<GroupKey, number[]> = {};

  for (const m of measures) {
    const date = new Date(m.unixTime * 1000);
    let key = "";

    if (type === "hour") key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
    if (type === "day") key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (type === "month") key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!groups[key]) groups[key] = [];
    groups[key].push(m.value);
  }

  return Object.entries(groups).map(([key, values]) => ({
    period: key,
    average: values.reduce((a, b) => a + b, 0) / values.length,
  }));
}

export async function gerarPdfEstacoes(id: string) {
  const stationRepo = AppDataSource.getRepository(Station);

  const stations = await stationRepo.find({
    relations: {
      parameters: {
        idTypeParameter: true,
        measures: true,
        typeAlerts: {
          alerts: {
            type: true,
            measure: true,
          },
        },
      },
    },
    where: { id: id },
  });

  // Configuração do documento
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  
  // Carregar o logo da TecSus
  const logoPath = path.join(__dirname, "../../../../src/static/img/tecsus-logo.png");
  let logoBase64 = "";
  let logoHeaderH = 0;
  let logoCoverH = 0;
  
  try  {
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const dims = sizeOf(logoBuffer);    // lê width e height originais
      const base64 = logoBuffer.toString("base64");
      logoBase64 = "data:image/png;base64," + base64;

      // calcula altura escalonada para header (max width 16)
      const maxW = 16;
      logoHeaderH = dims.height * (maxW / dims.width);

      // calcula altura escalonada para capa (max width 60)
      const maxWBig = 60;
      logoCoverH = dims.height * (maxWBig / dims.width);
    } else {
      console.warn("Logo não encontrado em: " + logoPath);
    }
  } catch (error) {
    console.error("Erro ao carregar o logo:", error);
  }
  
  // Cores
  const corPrimaria = [56, 52, 129];
  const corSecundaria = [87, 81, 212];
  const corAlerta = [231, 76, 60]; // Vermelho para alertas
  
  // Função para adicionar cabeçalho em cada página
  const adicionarCabecalho = () => {
    // Retângulo de cabeçalho
    doc.setFillColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    // Adicionar logo no cabeçalho se disponível
    if (logoBase64) {
      // Adicionar logo no canto esquerdo do cabeçalho
      doc.addImage(logoBase64, 'PNG', margin, 2, 16, logoHeaderH);
    }
    
    // Título do relatório
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório de Estação de Monitoramento', pageWidth / 2, 12, { align: 'center' });
    
    // Resetar cor do texto
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };
  
  // Função para adicionar rodapé em cada página
  const adicionarRodape = (numeroPagina: number) => {
    const totalPaginas = doc.getNumberOfPages();
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    // Adicionar logo pequeno no rodapé se disponível
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', pageWidth - margin - 10, pageHeight - 13, 8, 8);
    }
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${dataAtual}`, margin, pageHeight - 5);
    doc.text(`Página ${numeroPagina - 1} de ${totalPaginas}`, pageWidth - margin - 15, pageHeight - 5, { align: 'right' });
  };
  
  // Adicionar capa
  adicionarCabecalho();
  
  // Informações da estação na capa
  const station = stations[0]; // Assumindo que estamos gerando para uma estação específica
  if (station) {
    // Adicionar logo grande na capa se disponível
    if (logoBase64) {
      const logoX = (pageWidth - 60) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, 25, 60, logoCoverH);
    }
    
    doc.setFontSize(22);
    doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Estação: ${station.name}`, pageWidth / 2, logoBase64 ? 100 : 50, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Identificador: ${station.uuid}`, pageWidth / 2, logoBase64 ? 115 : 65, { align: 'center' });
    doc.text(`Localização: (${station.latitude}, ${station.longitude})`, pageWidth / 2, logoBase64 ? 125 : 75, { align: 'center' });
    
    // Adicionar data do relatório
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${dataAtual}`, pageWidth / 2, logoBase64 ? 140 : 90, { align: 'center' });
    
    // Adicionar rodapé na capa
    adicionarRodape(1);
  }
  
  // Para cada estação, criar páginas de conteúdo
  for (const station of stations) {
    // Adicionar nova página para o conteúdo
    doc.addPage();
    adicionarCabecalho();
    
    let y = 30; // Posição inicial após o cabeçalho
    
    // Título da estação
    doc.setFontSize(14);
    doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Estação: ${station.name}`, margin, y);
    y += 10;
    
    // Informações da estação
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`UUID: ${station.uuid}`, margin, y);
    y += 6;
    doc.text(`Localização: (${station.latitude}, ${station.longitude})`, margin, y);
    y += 10;
    
    // Para cada parâmetro
    for (const param of station.parameters) {
      // Verificar se precisa adicionar nova página
      if (y > pageHeight - 40) {
        adicionarRodape(doc.internal.pages.length);
        doc.addPage();
        adicionarCabecalho();
        y = 30;
      }
      
      // Título do parâmetro
      doc.setFillColor(corSecundaria[0], corSecundaria[1], corSecundaria[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
      doc.text(`Parâmetro: ${param.idTypeParameter.name} (${param.idTypeParameter.unit})`, margin + 2, y + 5.5);
      y += 12;
      
      // Resetar cor do texto
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      const measures = param.measures.map((m) => ({
        value: m.value,
        unixTime: m.unixTime,
      }));
      
      const hourly = groupAndAverage(measures, "hour");
      const daily = groupAndAverage(measures, "day");
      const monthly = groupAndAverage(measures, "month");
      
      // Função de desenhar gráfico removida conforme solicitado
      
      const writeAveragesTable = (label: string, data: { period: string; average: number }[]) => {
        if (y > pageHeight - 60) {
          adicionarRodape(doc.internal.pages.length);
          doc.addPage();
          adicionarCabecalho();
          y = 30;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Média ${label}:`, margin, y);
        y += 5;
        
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, 80, 7, 'F');
        doc.rect(margin + 80, y, 40, 7, 'F');
        
        doc.setFontSize(9);
        doc.text('Período', margin + 2, y + 5);
        doc.text('Valor Médio', margin + 82, y + 5);
        y += 7;
        
        doc.setFont('helvetica', 'normal');
        for (const item of data.slice(0, 5)) {
          doc.rect(margin, y, 80, 7);
          doc.rect(margin + 80, y, 40, 7);
          
          doc.text(item.period, margin + 2, y + 5);
          doc.text(`${item.average.toFixed(2)} ${param.idTypeParameter.unit}`, margin + 82, y + 5);
          y += 7;
        }
        
        if (data.length > 0) {
          y += 10; // Adicionar espaço após a tabela
        } else {
          y += 5;
        }
      };
      
      writeAveragesTable("Horária", hourly);
      writeAveragesTable("Diária", daily);
      writeAveragesTable("Mensal", monthly);
      
      if (param.typeAlerts.length > 0) {
        if (y > pageHeight - 40) {
          adicionarRodape(doc.internal.pages.length);
          doc.addPage();
          adicionarCabecalho();
          y = 30;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Alertas:', margin, y);
        y += 5;
        
        for (const typeAlert of param.typeAlerts) {
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
          doc.text(
            `Tipo: ${typeAlert.name} (${typeAlert.comparisonOperator} ${typeAlert.value})`,
            margin + 2,
            y + 5
          );
          y += 10;
          
          if (typeAlert.alerts.length > 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(margin, y, 60, 7, 'F');
            doc.rect(margin + 60, y, 70, 7, 'F');
            doc.rect(margin + 130, y, 40, 7, 'F');
            
            doc.setFontSize(9);
            doc.text('Tipo', margin + 2, y + 5);
            doc.text('Data/Hora', margin + 62, y + 5);
            doc.text('Valor', margin + 132, y + 5);
            y += 7;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(corAlerta[0], corAlerta[1], corAlerta[2]);
            
            for (const alert of typeAlert.alerts) {
              const date = parseUnixTimeToDate(alert.measure.unixTime).toLocaleString();
              const value = alert.measure.value;
              
              doc.rect(margin, y, 60, 7);
              doc.rect(margin + 60, y, 70, 7);
              doc.rect(margin + 130, y, 40, 7);
              
              doc.text(alert.type.name, margin + 2, y + 5);
              doc.text(date, margin + 62, y + 5);
              doc.text(`${value} ${param.idTypeParameter.unit}`, margin + 132, y + 5);
              y += 7;
              
              if (y > pageHeight - 20) {
                adicionarRodape(doc.internal.pages.length);
                doc.addPage();
                adicionarCabecalho();
                y = 30;
              }
            }
            
            // Resetar cor do texto
            doc.setTextColor(0, 0, 0);
            y += 5;
          } else {
            doc.text('Nenhum alerta registrado.', margin + 5, y);
            y += 7;
          }
        }
      }
      
      y += 10;
    }
    
    adicionarRodape(doc.internal.pages.length);
  }
  
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  doc.save("joao.pdf");
  return pdfBuffer;
}
