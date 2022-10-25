window.ethParser = require("eth-url-parser")

const BASE_URL = "https://flint-wallet.app.link";

const lovelaceMultiple = 1000000;

const weiMultiple = 1000000000000000000;

function renderUrl(url) {
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

function getScrollHeight(element) {
  var savedValue = element.value.replace(/\s/g, "")
  element.value = ""
  element._baseScrollHeight = element.scrollHeight
  element.value = savedValue
}

window.onExpandableTextareaInput = function ({ target: element }) {
  !element._baseScrollHeight && getScrollHeight(element)
  rows = Math.ceil((element.scrollHeight - element._baseScrollHeight) / 20)
  element.rows = rows
}

window.handleNetworkSelect = function () {
  let activeForm = ""
  if (document.getElementById("send-form").style.display == "block") {
    activeForm = "Send"
  } else if (document.getElementById("sign-form").style.display == "block") {
    activeForm = "Sign"
  }

  const networkId = document.getElementById(`networkId${activeForm}`)
  const identifier = document.getElementById(`identifier${activeForm}`)
  if (document.getElementById(`cardanoCoinType${activeForm}`).checked) {
    const networkValue = document.getElementById(
      `cardanoNetworks${activeForm}`
    ).value
    if (networkValue === "cardanoMainnet") {
      networkId.value = "1"
      identifier.value = "default"
    } else if (networkValue === "cardanoTestnet") {
      networkId.value = "0"
      identifier.value = "default"
    } else {
      networkId.value = ""
      identifier.value = "default"
    }
  }
  // TODO: Enable when eth is supported
  // else if (document.getElementById(`ethereumCoinType${activeForm}`).checked) {
  //   const networkValue = document.getElementById(
  //     `ethereumNetworks${activeForm}`
  //   ).value
  //   if (networkValue === "milkomedaMainnet") {
  //     networkId.value = "2001"
  //     identifier.value = ""
  //   } else if (networkValue === "milkomedaTestnet") {
  //     networkId.value = "200101"
  //     identifier.value = ""
  //   } else {
  //     networkId.value = ""
  //     identifier.value = ""
  //   }
  // }
}

window.handleCustomNetworkCheck = function (cb) {
  let activeForm = ""
  if (document.getElementById("send-form").style.display == "block") {
    activeForm = "Send"
  } else if (document.getElementById("sign-form").style.display == "block") {
    activeForm = "Sign"
  }
  const networkId = document.getElementById(`networkId${activeForm}`)
  const identifier = document.getElementById(`identifier${activeForm}`)
  const presetCardanoNetworks = document.getElementById(
    `cardanoNetworks${activeForm}`
  )
  const presetEthereumNetworks = document.getElementById(
    `ethereumNetworks${activeForm}`
  )
  networkId.value = ""
  identifier.value = ""
  if (cb.checked) {
    presetCardanoNetworks.value = "placeholder"
    presetEthereumNetworks.value = "placeholder"
    presetCardanoNetworks.setAttribute("disabled", "true")
    presetEthereumNetworks.setAttribute("disabled", "true")
    networkId.removeAttribute("disabled")
    identifier.removeAttribute("disabled")
    networkId.style.display = "block"
    identifier.style.display = "block"
  } else {
    presetCardanoNetworks.removeAttribute("disabled")
    presetEthereumNetworks.removeAttribute("disabled")
    networkId.setAttribute("disabled", "true")
    identifier.setAttribute("disabled", "true")
    networkId.style.display = "none"
    identifier.style.display = "none"
  }
}

window.handleCoinTypeCheck = function () {
  let activeForm = ""
  if (document.getElementById("send-form").style.display == "block") {
    activeForm = "Send"
  } else if (document.getElementById("sign-form").style.display == "block") {
    activeForm = "Sign"
  }
  const presetCardanoNetworks = document.getElementById(
    `cardanoNetworks${activeForm}`
  )
  const presetEthereumNetworks = document.getElementById(
    `ethereumNetworks${activeForm}`
  )
  if (document.getElementById(`cardanoCoinType${activeForm}`).checked) {
    presetCardanoNetworks.style.display = "block"
    presetEthereumNetworks.style.display = "none"
    // TODO: Enable when eth is supported
    // } else if (document.getElementById(`ethereumCoinType${activeForm}`).checked) {
    //   presetCardanoNetworks.style.display = "none"
    //   presetEthereumNetworks.style.display = "block"
  } else {
    alert("Invalid coin type")
  }
}

window.generateSendUrl = function () {
  const address = document.getElementById("address").value
  if(!address){
    alert("Address not entered");
    return;
  }
  let amount = Number.parseFloat(document.getElementById("amount").value)
  if(isNaN(amount)){
    alert("Invalid amount: Not a number");
    return;
  }
  const networkId = document.getElementById("networkIdSend").value
  const identifier = document.getElementById("identifierSend").value
  let coinType

  document.getElementById("url").innerText = ""

  if (document.getElementById("cardanoCoinTypeSend").checked) {
    coinType = document.getElementById("cardanoCoinTypeSend").value
    // TODO: Enable when eth is supported
    // } else if (document.getElementById("ethereumCoinTypeSend").checked) {
    //   coinType = document.getElementById("ethereumCoinTypeSend").value
  } else {
    alert("Invalid coin type")
    return
  }

  if (networkId === "" && identifier === "") {
    alert("Network not selected")
    return
  }

  amount *= coinType === 'cardano' ? lovelaceMultiple : weiMultiple;
  const intAmount = BigInt(amount).toString();

  try {
    const url =
      `${BASE_URL}/send?` +
      "coinType=" +
      coinType +
      "&address=" +
      address +
      "&amount=" +
      intAmount +
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
  if (dapp_url.search("https://") !== -1) {
    const url = `${BASE_URL}/browse?dappUrl=` + encodeURIComponent(dapp_url);
    renderUrl(url)
  } else {
    alert("The url needs to start with https://")
  }
}

window.generateSignUrl = function () {
  const CBOR = document.getElementById("CBOR").value.trim()
  const networkId = document.getElementById("networkIdSign").value

  if (networkId === "") {
    alert("Network not selected")
    return
  }

  let coinType

  if (document.getElementById("cardanoCoinTypeSign").checked) {
    coinType = document.getElementById("cardanoCoinTypeSign").value
    // TODO: Enable when eth is supported
    // } else if (document.getElementById("ethereumCoinTypeSign").checked) {
    //   coinType = document.getElementById("ethereumCoinTypeSign").value
  } else {
    alert("Invalid coin type")
    return
  }
  const url =
    `${BASE_URL}/sign?` +
    "CBOR=" +
    CBOR +
    "&networkId=" +
    networkId +
    "&coinType=" +
    coinType
  renderUrl(url)
}

window.showView = function (name) {
  if (name === "dapp") {
    document.getElementById("dapp-form").style.display = "block"
  } else if (name === "send") {
    document.getElementById("send-form").style.display = "block"
  } else if (name === "sign") {
    document.getElementById("sign-form").style.display = "block"
  } else {
    alert("Not implemented")
  }
  document.getElementById("buttons").style.display = "none"
}

// This is just a placeholder for proper validation
window.isValidAddress = function (address) {
  return address.length === 42 && address.toLowerCase().substr(0, 2) === "0x"
}

// For textarea to auto expand
document.addEventListener("input", onExpandableTextareaInput)
