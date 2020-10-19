# bitcoin-wallet

Wallet muy simple que se accede a través de la consola (CMD en windows o terminal en UNIX).

Antes de correr la aplicación se debe hacer un npm install para instalar todas las dependencias (se asume que se tiene instalado node).

Para correr la aplicación usar el comando: **node tareaWallet.js** (estando parado dentro del directorio del proyecto).

Luego seguir las instrucciones para realizar las distintas operaciones.

***La wallet funciona en la testnet. Intentar usar addresses de otra red resultará en error.***

#### Datos de prueba:

- Sender address: mtdHT5LSbvw449zDGzvPD2eWrXPNmpfYge
- Sender WIF: cVN8HhweU4obeakVQyRU1nJaKRvMPVPWAArGijGchc3DTkdsk5FK (se usa el WIF en lugar de la private key para transferir BTCs)
- Recipient address: mqQHwpYeRnZdbZmzGaVDGiyFQmmafDMkmW


#### Observación:

Al intentar enviar BTCs con las credenciales anteriores se pudo transferir varias veces. Sin embargo, después de haber hecho cierto número de transferencias la API de blockcypher responde con un error HTTP 409 "Conflict" y ningún mensaje de error que ayude a entender la causa. Quizás se llegó a un máximo de transferencias en cierto intervalo de tiempo.
