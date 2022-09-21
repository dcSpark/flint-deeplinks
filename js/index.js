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

window.handleNetworkSelect = function () {
  const networkId = document.getElementById("network_id")
  const identifier = document.getElementById("identifier")
  if (document.getElementById("cardanoCoinType").checked) {
    if (document.getElementById("cardanoNetworks").value === "cardanoMainnet") {
      networkId.value = "1"
      identifier.value = ""
    } else if (
      document.getElementById("cardanoNetworks").value === "cardanoTestnet"
    ) {
      networkId.value = "0"
      identifier.value = ""
    } else {
      networkId.value = ""
      identifier.value = ""
    }
  }
  // TODO: Enable when eth is supported
  // else if (document.getElementById("ethereumCoinType").checked) {
  //   if (
  //     document.getElementById("ethereumNetworks").value === "milkomedaMainnet"
  //   ) {
  //     networkId.value = "2001"
  //     identifier.value = ""
  //   } else if (
  //     document.getElementById("ethereumNetworks").value === "milkomedaTestnet"
  //   ) {
  //     networkId.value = "200101"
  //     identifier.value = ""
  //   } else {
  //     networkId.value = ""
  //     identifier.value = ""
  //   }
  // }
}

window.handleCustomNetworkCheck = function (cb) {
  const networkId = document.getElementById("network_id")
  const identifier = document.getElementById("identifier")
  const presetCardanoNetworks = document.getElementById("cardanoNetworks")
  const presetEthereumNetworks = document.getElementById("ethereumNetworks")
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
  const presetCardanoNetworks = document.getElementById("cardanoNetworks")
  const presetEthereumNetworks = document.getElementById("ethereumNetworks")
  if (document.getElementById("cardanoCoinType").checked) {
    presetCardanoNetworks.style.display = "block"
    presetEthereumNetworks.style.display = "none"
    // TODO: Enable when eth is supported
    //   } else if (document.getElementById("ethereumCoinType").checked) {
    //     presetCardanoNetworks.style.display = "none"
    //     presetEthereumNetworks.style.display = "block"
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
  const networkId = document.getElementById("network_id").value
  const identifier = document.getElementById("identifier").value
  let coinType;

  document.getElementById("url").innerText = ""
  document.getElementById("url").href = ""
  document.getElementById("qr-wrapper").replaceChildren()

  if (document.getElementById("cardanoCoinType").checked) {
    coinType = document.getElementById("cardanoCoinType").value

  
    // TODO: Enable when eth is supported
    //   } else if (document.getElementById("ethereumCoinType").checked) {
    //     coinType = document.getElementById("ethereumCoinType").value
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
    const url = `${BASE_URL}/browse?dappUrl=` + dapp_url
    renderUrl(url)
  } else {
    alert("The url needs to start with https://")
  }
}

window.showView = function (name) {
  if (name === "dapp") {
    document.getElementById("dapp-form").style.display = "block"
  } else if (name === "send") {
    document.getElementById("send-form").style.display = "block"
  }
  document.getElementById("buttons").style.display = "none"
}

// This is just a placeholder for proper validation
window.isValidAddress = function (address) {
  return address.length === 42 && address.toLowerCase().substr(0, 2) === "0x"
}
