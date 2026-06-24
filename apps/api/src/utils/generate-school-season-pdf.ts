import PDFDocument from 'pdfkit'

interface PdfData {
  school: {
    name: string
  }
  season: {
    name: string
    status: 'ACTIVE' | 'FINISHED'
    startedAt: Date
    endedAt: Date | null
  }
  stats: {
    totalPoints: number
    totalItemsRecycled: number
    participantsCount: number
    collectionsCount: number
  }
  classroomsLeaderboard: Array<{
    id: string
    name: string
    year: string
    totalPoints: number
    studentsCount: number
    participationRate: number
  }>
  mostRecycledItems: Array<{
    id: string
    name: string
    totalQuantity: number
    pointsValue: number
  }>
  ranking: Array<{
    id: string
    name: string
    className: string
    totalPoints: number
  }>
  studentsHistory: Array<{
    id: string
    name: string
    className: string
    totalPoints: number
    points: Array<{
      id: string
      amount: number
      createdAt: Date
      scoreItems: Array<{
        id: string
        amount: number
        value: number
        itemName: string
      }>
    }>
  }>
  isSimple: boolean
}

export function generateSchoolSeasonPdf(data: PdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true,
      })

      const buffers: Buffer[] = []
      doc.on('data', (chunk) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', (err) => reject(err))

      // Brand Colors (OkLch to Hex equivalents)
      const primaryColor = '#10B981' // Emerald Green
      const textDark = '#1F2937' // Charcoal
      const textLight = '#6B7280' // Slate
      const borderColor = '#E5E7EB' // Light Grey
      const bgLight = '#F9FAFB' // Soft White/Grey

      // --- PAGE 1: RESUMO GERAL ---
      // Brand Accent Top Bar
      doc.fillColor(primaryColor).rect(0, 0, 595, 15).fill()

      // Header Title
      doc
        .fillColor(primaryColor)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('ecokids', 50, 45)
      doc
        .fillColor(textDark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('RELATÓRIO DE DESEMPENHO', 50, 80)

      const generatedAtStr = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      doc
        .fillColor(textLight)
        .fontSize(8)
        .font('Helvetica')
        .text(generatedAtStr, 50, 81, { align: 'right', width: 495 })

      // Divider line
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 95)
        .lineTo(545, 95)
        .stroke()

      // School & Season Info Block
      doc
        .fillColor(textDark)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(data.school.name, 50, 115)
      doc
        .fillColor(textLight)
        .fontSize(12)
        .font('Helvetica')
        .text(`Ciclo: ${data.season.name}`, 50, 135)

      // Status Badge
      const statusText =
        data.season.status === 'ACTIVE' ? 'ATIVO' : 'FINALIZADO'
      const statusColor =
        data.season.status === 'ACTIVE' ? '#10B981' : '#6B7280'
      doc.save()
      doc.fillColor(statusColor).rect(50, 155, 90, 18).fill()
      doc
        .fillColor('#FFFFFF')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(statusText, 50, 160, { width: 90, align: 'center' })
      doc.restore()

      // Details Block
      const startStr = new Date(data.season.startedAt).toLocaleDateString(
        'pt-BR',
      )
      const endStr = data.season.endedAt
        ? new Date(data.season.endedAt).toLocaleDateString('pt-BR')
        : 'Em andamento'

      const infoY = 190
      doc
        .fillColor(textDark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Data de Início:', 90, infoY)
      doc.fillColor(textDark).font('Helvetica').text(startStr, 170, infoY)

      doc
        .fillColor(textDark)
        .font('Helvetica-Bold')
        .text('Data de Fim:', 330, infoY)
      doc.fillColor(textDark).font('Helvetica').text(endStr, 400, infoY)

      // Section Stats Header
      doc
        .fillColor(textDark)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Métricas Globais', 50, 250)
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 268)
        .lineTo(545, 268)
        .stroke()

      // 2x2 Grid of Stats Cards
      const cardW = 235
      const cardH = 75
      const cardGap = 20

      const drawStatCard = (
        title: string,
        value: string,
        sub: string,
        x: number,
        y: number,
      ) => {
        doc.save()
        doc.fillColor(bgLight).strokeColor(borderColor).lineWidth(1)
        doc.roundedRect(x, y, cardW, cardH, 6).fillAndStroke()

        doc
          .fillColor(textLight)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(title.toUpperCase(), x + 15, y + 15)
        doc
          .fillColor(primaryColor)
          .fontSize(20)
          .font('Helvetica-Bold')
          .text(value, x + 15, y + 27)
        doc
          .fillColor(textLight)
          .fontSize(8)
          .font('Helvetica')
          .text(sub, x + 15, y + 52)
        doc.restore()
      }

      drawStatCard(
        'Total de Pontos',
        data.stats.totalPoints.toLocaleString('pt-BR'),
        'Pontuação acumulada de todos os alunos',
        50,
        285,
      )

      drawStatCard(
        'Itens Reciclados',
        data.stats.totalItemsRecycled.toLocaleString('pt-BR'),
        'Quantidade total de unidades entregues',
        50 + cardW + cardGap,
        285,
      )

      drawStatCard(
        'Alunos Participantes',
        data.stats.participantsCount.toString(),
        'Alunos que realizaram entregas no ciclo',
        50,
        285 + cardH + cardGap,
      )

      drawStatCard(
        'Registros de Coleta',
        data.stats.collectionsCount.toString(),
        'Quantidade de operações de pesagem',
        50 + cardW + cardGap,
        285 + cardH + cardGap,
      )

      // Section Dashboard Details Header
      doc
        .fillColor(textDark)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Detalhamento de Classes e Materiais', 50, 480)
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 498)
        .lineTo(545, 498)
        .stroke()

      // Column 1: Classrooms Leaderboard (Left)
      doc
        .fillColor(textDark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Ranking das Classes', 50, 515)

      doc
        .strokeColor(borderColor)
        .lineWidth(0.5)
        .moveTo(50, 530)
        .lineTo(280, 530)
        .stroke()

      let leaderY = 540
      const topClasses = data.classroomsLeaderboard.slice(0, 4)
      if (topClasses.length === 0) {
        doc
          .fillColor(textLight)
          .fontSize(9)
          .font('Helvetica')
          .text('Nenhuma classe registrada.', 50, leaderY)
      } else {
        topClasses.forEach((cls, idx) => {
          doc
            .fillColor(idx === 0 ? primaryColor : textDark)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(`${idx + 1}º`, 50, leaderY)

          doc
            .fillColor(textDark)
            .font('Helvetica')
            .text(cls.name, 75, leaderY, { width: 110, lineBreak: false })

          doc
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(`${cls.totalPoints} pts`, 190, leaderY, {
              width: 90,
              align: 'right',
            })

          doc
            .fillColor(textLight)
            .font('Helvetica')
            .fontSize(8)
            .text(`(${cls.participationRate}% part.)`, 190, leaderY + 10, {
              width: 90,
              align: 'right',
            })

          leaderY += 25
        })
      }

      // Column 2: Most Recycled Items (Right)
      doc
        .fillColor(textDark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Materiais Mais Entregues', 315, 515)

      doc
        .strokeColor(borderColor)
        .lineWidth(0.5)
        .moveTo(315, 530)
        .lineTo(545, 530)
        .stroke()

      let itemsY = 540
      const topItems = data.mostRecycledItems.slice(0, 4)
      if (topItems.length === 0) {
        doc
          .fillColor(textLight)
          .fontSize(9)
          .font('Helvetica')
          .text('Nenhum item entregue.', 315, itemsY)
      } else {
        topItems.forEach((item) => {
          doc
            .fillColor(textDark)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(item.name, 315, itemsY, { width: 120, lineBreak: false })

          doc
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(
              `${item.totalQuantity.toLocaleString('pt-BR')} un`,
              445,
              itemsY,
              { width: 100, align: 'right' },
            )

          doc
            .fillColor(textLight)
            .font('Helvetica')
            .fontSize(8)
            .text(`(${item.pointsValue} pts/un)`, 445, itemsY + 10, {
              width: 100,
              align: 'right',
            })

          itemsY += 25
        })
      }

      // Footer brand notice
      doc
        .fillColor(textLight)
        .fontSize(8)
        .font('Helvetica')
        .text('Ecokids — Educação para o Futuro Sustentável', 50, 770, {
          align: 'center',
          width: 495,
        })

      // --- PAGE 2: RANKING GERAL ---
      doc.addPage()

      // Title
      doc
        .fillColor(textDark)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Ranking Geral dos Alunos', 50, 50)
      doc
        .fillColor(textLight)
        .fontSize(10)
        .font('Helvetica')
        .text('Classificação por pontuação acumulada neste ciclo.', 50, 72)
      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 88)
        .lineTo(545, 88)
        .stroke()

      // Table Headers
      let tableY = 105
      doc.fillColor(textLight).fontSize(9).font('Helvetica-Bold')
      doc.text('POS.', 50, tableY)
      doc.text('ESTUDANTE', 100, tableY)
      doc.text('CLASSE', 350, tableY)
      doc.text('PONTOS ACUMULADOS', 450, tableY, { width: 95, align: 'right' })

      doc
        .strokeColor(borderColor)
        .lineWidth(1)
        .moveTo(50, 118)
        .lineTo(545, 118)
        .stroke()

      let currentY = 125
      if (data.ranking.length === 0) {
        doc
          .fillColor(textLight)
          .fontSize(11)
          .font('Helvetica')
          .text('Nenhuma pontuação registrada neste ciclo.', 50, currentY, {
            align: 'center',
            width: 495,
          })
      } else {
        data.ranking.forEach((student, index) => {
          // Check page overflow
          if (currentY > 730) {
            doc.addPage()
            // Redraw Header
            doc
              .fillColor(textDark)
              .fontSize(14)
              .font('Helvetica-Bold')
              .text('Ranking Geral (Continuação)', 50, 50)
            doc
              .strokeColor(borderColor)
              .lineWidth(1)
              .moveTo(50, 68)
              .lineTo(545, 68)
              .stroke()

            tableY = 85
            doc.fillColor(textLight).fontSize(9).font('Helvetica-Bold')
            doc.text('POS.', 50, tableY)
            doc.text('ESTUDANTE', 100, tableY)
            doc.text('CLASSE', 350, tableY)
            doc.text('PONTOS ACUMULADOS', 450, tableY, {
              width: 95,
              align: 'right',
            })
            doc
              .strokeColor(borderColor)
              .lineWidth(1)
              .moveTo(50, 98)
              .lineTo(545, 98)
              .stroke()

            currentY = 110
          }

          // Alternating row backgrounds
          if (index % 2 === 0) {
            doc.save()
            doc
              .fillColor(bgLight)
              .rect(50, currentY - 5, 495, 20)
              .fill()
            doc.restore()
          }

          // Row Content
          const isTop3 = index < 3
          doc
            .fillColor(isTop3 ? primaryColor : textDark)
            .fontSize(10)
            .font(isTop3 ? 'Helvetica-Bold' : 'Helvetica')
          doc.text(`${index + 1}º`, 50, currentY)

          doc.fillColor(textDark)
          doc.text(student.name, 100, currentY, {
            width: 240,
            lineBreak: false,
          })
          doc.text(student.className, 350, currentY)

          doc.fillColor(primaryColor).font('Helvetica-Bold')
          doc.text(`${student.totalPoints} pts`, 450, currentY, {
            width: 95,
            align: 'right',
          })

          currentY += 20
        })
      }

      // --- PAGE 3+: HISTÓRICO DETALHADO POR ALUNO (SOMENTE SE RELATÓRIO COMPLETO) ---
      if (!data.isSimple) {
        doc.addPage()

        // Page Title
        doc
          .fillColor(textDark)
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('Detalhamento de Entregas por Aluno', 50, 50)
        doc
          .fillColor(textLight)
          .fontSize(9)
          .font('Helvetica')
          .text(
            'Lista completa de entregas e itens reciclados por estudante.',
            50,
            70,
          )
        doc
          .strokeColor(borderColor)
          .lineWidth(1)
          .moveTo(50, 85)
          .lineTo(545, 85)
          .stroke()

        let currentY = 100

        if (data.studentsHistory.length === 0) {
          doc
            .fillColor(textLight)
            .fontSize(10)
            .font('Helvetica')
            .text('Nenhum histórico registrado neste ciclo.', 50, currentY)
        } else {
          data.studentsHistory.forEach((student) => {
            // Safe page break check before student section
            if (currentY > 730) {
              doc.addPage()
              doc
                .fillColor(textLight)
                .fontSize(8)
                .font('Helvetica-Bold')
                .text('HISTÓRICO DETALHADO DE ENTREGAS (CONTINUAÇÃO)', 50, 40)
              doc
                .strokeColor(borderColor)
                .lineWidth(0.5)
                .moveTo(50, 52)
                .lineTo(545, 52)
                .stroke()
              currentY = 65
            }

            // Draw student header row with light green background
            doc.save()
            doc
              .fillColor('#ECFDF5')
              .rect(50, currentY - 3, 495, 18)
              .fill()
            doc.restore()

            doc
              .fillColor(textDark)
              .fontSize(9.5)
              .font('Helvetica-Bold')
              .text(student.name, 55, currentY + 1)
            doc
              .fillColor(textLight)
              .fontSize(8)
              .font('Helvetica')
              .text(`Turma: ${student.className}`, 300, currentY + 1.8)
            doc
              .fillColor(primaryColor)
              .fontSize(9.5)
              .font('Helvetica-Bold')
              .text(`${student.totalPoints} pts`, 430, currentY + 1, {
                width: 105,
                align: 'right',
              })

            currentY += 20

            // Draw deliveries
            if (student.points.length === 0) {
              doc
                .fillColor(textLight)
                .fontSize(8)
                .font('Helvetica')
                .text('Nenhuma entrega registrada.', 70, currentY)
              currentY += 12
            } else {
              student.points.forEach((point) => {
                if (currentY > 750) {
                  doc.addPage()
                  doc
                    .fillColor(textLight)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(
                      `HISTÓRICO DETALHADO DE ENTREGAS — ${student.name.toUpperCase()} (CONT.)`,
                      50,
                      40,
                    )
                  doc
                    .strokeColor(borderColor)
                    .lineWidth(0.5)
                    .moveTo(50, 52)
                    .lineTo(545, 52)
                    .stroke()
                  currentY = 65
                }

                const dateStr = new Date(point.createdAt).toLocaleDateString(
                  'pt-BR',
                )
                const timeStr = new Date(point.createdAt).toLocaleTimeString(
                  'pt-BR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )

                doc
                  .fillColor(textDark)
                  .fontSize(8.5)
                  .font('Helvetica-Bold')
                  .text(`• Entrega em ${dateStr} às ${timeStr}`, 70, currentY)
                doc
                  .fillColor(primaryColor)
                  .fontSize(8.5)
                  .font('Helvetica-Bold')
                  .text(`+${point.amount} pts`, 430, currentY, {
                    width: 105,
                    align: 'right',
                  })

                currentY += 13

                // Draw items
                point.scoreItems.forEach((scoreItem) => {
                  if (currentY > 765) {
                    doc.addPage()
                    doc
                      .fillColor(textLight)
                      .fontSize(8)
                      .font('Helvetica-Bold')
                      .text(
                        `HISTÓRICO DETALHADO DE ENTREGAS — ${student.name.toUpperCase()} (CONT.)`,
                        50,
                        40,
                      )
                    doc
                      .strokeColor(borderColor)
                      .lineWidth(0.5)
                      .moveTo(50, 52)
                      .lineTo(545, 52)
                      .stroke()
                    currentY = 65
                  }

                  doc
                    .fillColor(textLight)
                    .fontSize(8)
                    .font('Helvetica')
                    .text(
                      `  - ${scoreItem.amount} un x ${scoreItem.itemName} (${scoreItem.value} pts/un)`,
                      85,
                      currentY,
                    )
                  doc
                    .fillColor(textDark)
                    .fontSize(8)
                    .font('Helvetica-Bold')
                    .text(
                      `+${scoreItem.amount * scoreItem.value} pts`,
                      430,
                      currentY,
                      {
                        width: 105,
                        align: 'right',
                      },
                    )

                  currentY += 12
                })
              })
            }

            // Space between students
            currentY += 8
          })
        }
      }

      // Add Page Numbers to all pages
      const pages = doc.bufferedPageRange()
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i)

        // Temporarily disable auto page break by setting bottom margin to 0
        const oldMargin = doc.page.margins.bottom
        doc.page.margins.bottom = 0

        // Skip brand bar on later pages, but we can draw a small top line
        if (i > 0) {
          doc.fillColor(primaryColor).rect(0, 0, 595, 5).fill()
        }

        doc.fillColor(textLight).fontSize(8).font('Helvetica')
        doc.text(`Página ${i + 1} de ${pages.count}`, 50, 800, {
          align: 'right',
          width: 495,
        })

        // Restore margin
        doc.page.margins.bottom = oldMargin
      }

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}
