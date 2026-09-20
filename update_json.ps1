$json = Get-Content -Raw -Path '.\questions.json' -Encoding UTF8 | ConvertFrom-Json

foreach ($area in $json.areas) {
    foreach ($q in $area.questions) {
        $newOpt = New-Object PSObject -Property @{
            text = 'No aplica para mi empresa'
            score = 'NA'
        }
        $q.options += $newOpt
    }
}

foreach ($q in $json.ageQuestions) {
    $newOpt = New-Object PSObject -Property @{
        text = 'No aplica para mi empresa'
        value = 'NA'
    }
    $q.options += $newOpt
}

$json | ConvertTo-Json -Depth 10 | Set-Content -Path '.\questions.json' -Encoding UTF8
