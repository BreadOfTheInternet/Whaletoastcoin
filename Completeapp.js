// ==== CONFIG ====
// Your deployed Whale Toast Swap contract address
const CONTRACT_ADDRESS = "0x89533867273E6300d6F20b10acD0EE3356Ce1974";

const connectBtn = document.getElementById("connect-btn");
const buyBtn     = document.getElementById("buy-btn");
const amountIn   = document.getElementById("amount-input");
const walletStat = document.getElementById("wallet-status");
const status     = document.getElementById("status");

let provider, signer;

connectBtn.onclick = async () => {
  status.textContent = "";
  if (!window.ethereum) {
    status.textContent = "❌ MetaMask not detected.";
    return;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    walletStat.textContent = `Connected: ${address.slice(0,6)}…${address.slice(-4)}`;
    walletStat.style.color = "green";

    connectBtn.disabled = true;
    connectBtn.textContent = "Connected";
    amountIn.disabled = false;
    buyBtn.disabled   = false;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Connection failed: " + (err.message || err);
  }
};

buyBtn.onclick = async () => {
  status.textContent = "";
  const amt = amountIn.value;
  if (!amt || isNaN(amt) || Number(amt) <= 0) {
    status.textContent = "❌ Enter a valid amount.";
    return;
  }

  try {
    const value = ethers.utils.parseEther(amt.toString());
    status.textContent = "⏳ Sending transaction…";

    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value
    });
    await tx.wait();

    status.innerHTML = `✅ Success!<br>
      <a href="https://polygonscan.com/tx/${tx.hash}" target="_blank">View on Polygonscan</a>`;
  } catch (err) {
    console.error(err);
    status.textContent = `❌ Tx failed: ${err.message}`;
  }
};
