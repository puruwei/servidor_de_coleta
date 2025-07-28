
import { initializeModules, modules } from './config/modules_config.js';
import { targets } from "./config/targets_config.js";

import { collectFingerprintData } from "../modules/fingerprintjs_collector.js";

/// Adiciona um botão para cada target chamando chamando a função colletct_fingerprints
document.addEventListener('DOMContentLoaded', () => {
  const buttonContainer = document.getElementById('buttons-container');
    if (!buttonContainer) return;

  targets.forEach(target => {
    const button = document.createElement('button');
    button.id = target.name;
    button.textContent = target.name;

    button.addEventListener('click', () => {
      collect_fingerprints(target.name);
    })

    buttonContainer.appendChild(button)
  })

})

function removeButtons() {
    const buttonContainer = document.getElementById('buttons-container');
    if (!buttonContainer) return;

    // Remove todos os filhos (botões)
    while (buttonContainer.firstChild) {
      buttonContainer.removeChild(buttonContainer.firstChild);
    }
  }

function showStart(moduleName){
  const buttonContainer = document.getElementById('buttons-container');
  const message = document.createElement('p');
  message.id = moduleName
  message.textContent = "A coleta do módulo " + moduleName +" foi iniciada e ainda não terminou!";
  message.style.fontSize = "1.2rem";
  message.style.color = "#FF0000";
  message.style.textAlign = "center";

  buttonContainer.appendChild(message);
}

function showFinish(moduleName){
  const novoStatus = document.getElementById(moduleName)
  novoStatus.textContent = "A coleta do módulo " + moduleName +" foi finalizada!";
  novoStatus.style.color = "#00FF00";
}

/// Tenta coletar os fingerprints de todos os módulos
async function collect_fingerprints(targetName){

  var fingerprint_data = await collectFingerprintData()
  fingerprint_data = JSON.parse(fingerprint_data)

  // console.log(fingerprint_data)
  // console.log(fingerprint_data.components)

  removeButtons()

  await initializeModules();

  modules.forEach(async module => {

    showStart(module.name)

    try{
      var attributes = await module.collector()

      console.log(attributes)
      var jsonAttributes = JSON.parse(attributes)

      // Adiciona hardwareConcurrency ao JSON, se existir
      if (fingerprint_data.components != undefined){

        if (fingerprint_data.components.deviceMemory && fingerprint_data.components.deviceMemory.value !== undefined){
          jsonAttributes.deviceMemory = fingerprint_data.components.deviceMemory.value;
        }

        if (fingerprint_data.components.hardwareConcurrency && fingerprint_data.components.hardwareConcurrency.value !== undefined){
          jsonAttributes.hardwareConcurrency = fingerprint_data.components.hardwareConcurrency.value;
        }

        if (fingerprint_data.components.platform && fingerprint_data.components.platform.value !== undefined){
          jsonAttributes.platform = fingerprint_data.components.platform.value;
        }

        if (fingerprint_data.components.vendor && fingerprint_data.components.vendor.value !== undefined){
          jsonAttributes.vendor = fingerprint_data.components.vendor.value;
        }

        if (fingerprint_data.components.vendorFlavors && fingerprint_data.components.vendorFlavors.value !== undefined){
          jsonAttributes.vendorFlavors = fingerprint_data.components.vendorFlavors.value;
        }

        if (fingerprint_data.components.videoCard && fingerprint_data.components.videoCard.value !== undefined){
          if (fingerprint_data.components.videoCard.value.vendor != undefined){
            jsonAttributes.videoCardVendor = fingerprint_data.components.videoCard.value.vendor
          }
          if (fingerprint_data.components.videoCard.value.renderer != undefined){
            jsonAttributes.videoCardRenderer = fingerprint_data.components.videoCard.value.renderer
          }
        }

        if (fingerprint_data.components.architecture && fingerprint_data.components.architecture.value !== undefined){
          jsonAttributes.architecture = fingerprint_data.components.architecture.value;
        }

      }

      await fetch("/"+module.name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lab: targetName, attributes: jsonAttributes})
      })

    }catch(error){
      console.error(`Erro ao inicializar ${module.name}:`, error);
    }

    showFinish(module.name)

  })
}

