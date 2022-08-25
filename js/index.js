window.ethParser = require("eth-url-parser")

let paramFields = []
const BASE_URL = "https://flint-wallet.app.link"

function renderUrl(url) {
  console.log(url)
  document.getElementById("url").href = url
  document.getElementById("url").innerText = url

  const baseImgUrl =
    "http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=${DATA}&qzone=1&margin=0&size=250x250&ecc=L"
  const qrCodeUrl = baseImgUrl.replace("${DATA}", escape(url))

  if (document.getElementById("qr-wrapper").firstElementChild) {
    const img = document.getElementById("qr-wrapper").firstElementChild
    img.src = qrCodeUrl
  } else {
    const img = document.createElement("img")
    img.src = qrCodeUrl
    document.getElementById("qr-wrapper").appendChild(img)
  }
}

window.handleNetworkSelect = function () {
  const presetNetwork = document.getElementById("networks").value
  const networkId = document.getElementById("network_id")
  const identifier = document.getElementById("identifier")
  if (presetNetwork === "placeholder") return
  else if (presetNetwork === "cardanoMainnet") {
    networkId.value = "0"
    identifier.value = ""
  } else if (presetNetwork === "cardanoTestnet") {
    networkId.value = "300"
    identifier.value = ""
  }
}

window.handleCustomNetworkCheck = function (cb) {
  const networkId = document.getElementById("network_id")
  const identifier = document.getElementById("identifier")
  const presetNetwork = document.getElementById("networks")
  if (cb.checked) {
    presetNetwork.value = "placeholder"
    networkId.value = ""
    identifier.value = ""
    presetNetwork.setAttribute("disabled", "true")
    networkId.removeAttribute("disabled")
    identifier.removeAttribute("disabled")
    networkId.style.display = "block"
    identifier.style.display = "block"
  } else {
    presetNetwork.removeAttribute("disabled")
    networkId.setAttribute("disabled", "true")
    identifier.setAttribute("disabled", "true")
    networkId.style.display = "none"
    identifier.style.display = "none"
  }
}

window.generateSendUrl = function () {
  const address = document.getElementById("address").value
  const amount = document.getElementById("amount").value
  const networkId = document.getElementById("network_id").value
  const identifier = document.getElementById("identifier").value

  try {
    const url =
      `${BASE_URL}/send?` +
      "address=" +
      address +
      "&amount=" +
      amount +
      "&networkId=" +
      networkId +
      "&identifier=" +
      identifier
    renderUrl(url)
  } catch (e) {
    alert(e.toString())
  }
}

window.generateDappUrl = function () {
  const dapp_url = document.getElementById("dapp_url").value.trim()
  console.log(dapp_url)
  if (dapp_url.search("https://") !== -1) {
    const url = `${BASE_URL}/browse?dappUrl=` + dapp_url
    renderUrl(url)
  } else {
    alert("The url needs to start with https://")
  }
}

window.showView = function (name) {
  if (name === "dapp") {
    document.getElementById("dapp-form").style.display = "block"
  } else if (name === "payment-channel-request") {
    document.getElementById("payment-channel-request-form").style.display =
      "block"
    document.getElementById("reset").style.display = "block"
  } else if (name === "send") {
    document.getElementById("send-form").style.display = "block"
  }
  document.getElementById("buttons").style.display = "none"
  document.getElementById("reset").style.display = "block"
}

// This is just a placeholder for proper validation
window.isValidAddress = function (address) {
  return address.length === 42 && address.toLowerCase().substr(0, 2) === "0x"
}
