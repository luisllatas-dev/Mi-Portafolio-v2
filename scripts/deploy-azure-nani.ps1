<#
.SYNOPSIS
  Crea App Service (Python) + Managed Identity + rol sobre Foundry y despliega el backend.

.NOTES
  Requiere: az login con Owner/Contributor en la suscripción.
  No crea App Registration: usa system-assigned managed identity.
#>
param(
  [string]$Location = "eastus2",
  [string]$ResourceGroup = "rg-portafolio-nani",
  [string]$AppPlan = "plan-portafolio-nani",
  [string]$AppName = "app-nani-luis",          # debe ser globalmente único
  [string]$FoundryRg = "rg-ch73014115-7770",
  [string]$FoundryAccount = "ch73014115-5657-resource",
  [string]$Sku = "B1",
  [switch]$SkipDeploy,
  [switch]$Docker
)

$ErrorActionPreference = "Stop"
$BackendDir = Join-Path $PSScriptRoot "..\backend"
$FoundryScope = "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$FoundryRg/providers/Microsoft.CognitiveServices/accounts/$FoundryAccount"

Write-Host "== 1. Resource group ==" -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location --output none

Write-Host "== 2. App Service plan ($Sku) ==" -ForegroundColor Cyan
if ($Docker) {
  az appservice plan create `
    --name $AppPlan `
    --resource-group $ResourceGroup `
    --is-linux `
    --sku $Sku `
    --output none
} else {
  az appservice plan create `
    --name $AppPlan `
    --resource-group $ResourceGroup `
    --is-linux `
    --sku $Sku `
    --output none
}

Write-Host "== 3. Web app ==" -ForegroundColor Cyan
if ($Docker) {
  # Placeholder: requiere ACR/imagen; ruta opcional
  az webapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --plan $AppPlan `
    --deployment-container-image-name "mcr.microsoft.com/appsvc/python:3.12" `
    --output none
} else {
  az webapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --plan $AppPlan `
    --runtime "PYTHON:3.12" `
    --output none
}

Write-Host "== 4. Managed Identity (system-assigned) ==" -ForegroundColor Cyan
$identityJson = az webapp identity assign --name $AppName --resource-group $ResourceGroup -o json
$principalId = ($identityJson | ConvertFrom-Json).principalId
Write-Host "Principal ID: $principalId"

Write-Host "== 5. Rol sobre Foundry ==" -ForegroundColor Cyan
Write-Host "Scope: $FoundryScope"
# Intentar Azure AI User; si no existe, Cognitive Services User
az role assignment create `
  --assignee-object-id $principalId `
  --assignee-principal-type ServicePrincipal `
  --role "Azure AI User" `
  --scope $FoundryScope `
  --output none 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Azure AI User no disponible, probando Cognitive Services User..." -ForegroundColor Yellow
  az role assignment create `
    --assignee-object-id $principalId `
    --assignee-principal-type ServicePrincipal `
    --role "Cognitive Services User" `
    --scope $FoundryScope `
    --output none
}

Write-Host "== 6. App settings ==" -ForegroundColor Cyan
az webapp config appsettings set `
  --name $AppName `
  --resource-group $ResourceGroup `
  --settings `
    FOUNDRY_PROJECT_ENDPOINT="https://ch73014115-5657-resource.services.ai.azure.com/api/projects/ch73014115-5657" `
    FOUNDRY_AGENT_NAME="Nani" `
    FOUNDRY_AGENT_VERSION="1" `
    CHAT_MAX_QUESTIONS="5" `
    ALLOWED_ORIGINS="https://luiseduardo.online,https://luiseduardoportafolio.vercel.app,http://localhost:5173" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    ENABLE_ORYX_BUILD="true" `
  --output none

if ($SkipDeploy) {
  Write-Host "Deploy omitido (-SkipDeploy)" -ForegroundColor Yellow
} else {
  Write-Host "== 7. Deploy ZIP ==" -ForegroundColor Cyan
  $zip = Join-Path $env:TEMP "nani-backend.zip"
  if (Test-Path $zip) { Remove-Item $zip -Force }
  # Solo contenido de backend/
  Compress-Archive -Path (Join-Path $BackendDir "*") -DestinationPath $zip
  az webapp deploy `
    --name $AppName `
    --resource-group $ResourceGroup `
    --src-path $zip `
    --type zip `
    --clean true `
    --output none
}

$hostname = "https://$AppName.azurewebsites.net"
Write-Host ""
Write-Host "LISTO" -ForegroundColor Green
Write-Host "API:   $hostname/chat"
Write-Host "Health:$hostname/health"
Write-Host ""
Write-Host "En Vercel → Settings → Environment Variables:"
Write-Host "  VITE_CHAT_API_URL=$hostname/chat"
Write-Host ""
Write-Host "Nota: el rol de Managed Identity puede tardar hasta 24h en propagarse; prueba health y luego chat."
