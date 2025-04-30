let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

function generateAddress() {
  return "T" + Math.random().toString(36).substring(2, 12).toUpperCase();
}

document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (pass !== confirm) return alert("كلمة السر غير متطابقة");

  const userId = email || phone;
  if (users.find(u => u.id === userId)) return alert("المستخدم مسجل بالفعل");

  const newUser = {
    id: userId,
    name,
    password: pass,
    wallet: generateAddress(),
    link: `https://tron.link/#/${generateAddress()}`,
    balanceUSD: 0,
    balanceTRX: 0,
    usdt: 0,
    usdd: 0,
    trx: 0,
    transfers: [],
    received: [],
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("تم تسجيل الحساب بنجاح");
  document.getElementById("register-form").reset();
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("loginId").value;
  const pass = document.getElementById("loginPassword").value;

  const user = users.find(u => u.id === id && u.password === pass);
  if (!user) return alert("بيانات الدخول غير صحيحة");

  currentUser = user;
  showWallet();
});

function showWallet() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("wallet-section").style.display = "block";

  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("walletAddress").textContent = currentUser.wallet;
  document.getElementById("walletLink").textContent = currentUser.link;
  document.getElementById("balanceUSD").textContent = currentUser.balanceUSD;
  document.getElementById("balanceTRX").textContent = currentUser.balanceTRX;
  document.getElementById("assetTRX").textContent = currentUser.trx;
  document.getElementById("assetUSDT").textContent = currentUser.usdt;
  document.getElementById("assetUSDD").textContent = currentUser.usdd;

  updateHistory();
}

function showSend() {
  document.getElementById("send-section").style.display = "block";
}

function sendFunds() {
  const toAddress = document.getElementById("sendTo").value;
  const amount = parseFloat(document.getElementById("sendAmount").value);
  const receiver = users.find(u => u.wallet === toAddress);

  if (!receiver) return alert("المحفظة غير موجودة");
  if (currentUser.usdt < amount) return alert("الرصيد غير كافي");

  currentUser.usdt -= amount;
  currentUser.balanceUSD -= amount;
  currentUser.transfers.push({ to: toAddress, amount, time: new Date().toLocaleString() });

  receiver.usdt += amount;
  receiver.balanceUSD += amount;
  receiver.received.push({ from: currentUser.wallet, amount, time: new Date().toLocaleString() });

  alert(`تم إرسال ${amount} USDT إلى ${toAddress}`);
  localStorage.setItem("users", JSON.stringify(users));
  showWallet();
}

function updateHistory() {
  const tList = document.getElementById("transferHistory");
  const rList = document.getElementById("receiveHistory");
  tList.innerHTML = "";
  rList.innerHTML = "";

  currentUser.transfers.forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `أرسلت ${tx.amount} إلى ${tx.to} في ${tx.time}`;
    tList.appendChild(li);
  });

  currentUser.received.forEach(rx => {
    const li = document.createElement("li");
    li.textContent = `استلمت ${rx.amount} من ${rx.from} في ${rx.time}`;
    rList.appendChild(li);
  });
}
