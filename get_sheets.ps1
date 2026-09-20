 = New-Object -ComObject Excel.Application
 = .Workbooks.Open('C:\Users\emili\OneDrive\Desktop\Developer\Diagnóstico de preguntas revela fugas operativas\Matriz_de_Evolucion_Operativa 2.xlsx')
foreach ($sheet in $workbook.Sheets) { Write-Host $sheet.Name }
.Close()
.Quit()
