# Compiled index.html utilizing replacements.json dynamically without BOM

$htmlPath = ".\zaphera_temp.html"
$indexPath = ".\index.html"
$jsonPath = ".\replacements.json"

# Resolve absolute paths
$htmlAbsPath = [System.IO.Path]::GetFullPath($htmlPath)
$indexAbsPath = [System.IO.Path]::GetFullPath($indexPath)
$jsonAbsPath = [System.IO.Path]::GetFullPath($jsonPath)

# Read HTML as UTF-8
$html = [System.IO.File]::ReadAllText($htmlAbsPath, [System.Text.Encoding]::UTF8)

# 1. Replace the inline style block with a stylesheet link
$html = $html -replace '(?s)<style>.*?</style>', '<link rel="stylesheet" href="assets/css/style.css">'

# 2. Replace the last inline script block with a script link
$html = [regex]::Replace($html, '(?s)<script>(?!.*<script>).*?</script>', '<script src="assets/js/main.js"></script>')

# 3. Read replacements dictionary and loop through them
$json = [System.IO.File]::ReadAllText($jsonAbsPath, [System.Text.Encoding]::UTF8)
$replacements = ConvertFrom-Json $json
foreach ($r in $replacements) {
    $html = $html.Replace($r.search, $r.replace)
}

# 4. Save compiled HTML without BOM
$utf8NoBOM = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($indexAbsPath, $html, $utf8NoBOM)
Write-Output "Compiled index.html successfully with replacements from replacements.json (UTF-8 without BOM)."
