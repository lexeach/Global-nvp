import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, USDT } from "../../utils/web3.js";
import Footer from "../Footer.js";

// Ensure Buffer is available globally for Web3/Blockchain libraries
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

// Initialize Web3 outside to prevent recreation on every render
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const Dashboard = () => {

  // State Management
  const [account, setAccount] = useState("");
  const [registration_Free, setRegistrationFee] = useState(0);
  const [currUserID, setCurrUserID] = useState(0);
  const [getNextReward, setGetNextReward] = useState(0);
  const [level_income, setLevel_income] = useState(0);
  const [tokenReward, setTokenReward] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  const [userId, setUserId] = useState(0);
  const [userReferrerID, setUserReferrerID] = useState(0);
  const [userReferredUsers, setUserReferredUsers] = useState(0);
  const [userIncome, setUserIncome] = useState(0);
  const [userAutoPoolPayReceived, setUserAutoPoolPayReceived] = useState(0);
  const [userAutopoolPayReciever, setUserAutopoolPayReciever] = useState(0);
  const [userLevelIncomeReceived, setUserLevelIncomeReceived] = useState(0);

  const [copied, setCopied] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [referrerId, setReferrerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadData() {
      try {

        const accounts = await web3.eth.requestAccounts();

        if (!accounts || accounts.length === 0) {
          alert("Please install or unlock MetaMask");
          return;
        }

        const userAccount = accounts[0];
        setAccount(userAccount);

        const contract = new web3.eth.Contract(ICU.ABI, ICU.address);

        // Fetch Global Data
        const regFee = await contract.methods.REGESTRATION_FESS().call();
        setRegistrationFee(web3.utils.fromWei(regFee, "ether"));

        const currentId = await contract.methods.currUserID().call();
        setCurrUserID(currentId);

        const nextRew = await contract.methods.getNextReward().call();
        setGetNextReward(Number(web3.utils.fromWei(nextRew, "ether")).toFixed(2));

        const lvlInc = await contract.methods.level_income().call();
        setLevel_income(Number(web3.utils.fromWei(lvlInc, "ether")).toFixed(2));

        const price = await contract.methods.tokenPrice().call();
        setTokenPrice(Number(web3.utils.fromWei(price, "ether")).toFixed(4));

        const reward = await contract.methods.tokenReward().call();
        setTokenReward(Number(web3.utils.fromWei(reward, "ether")).toFixed(2));

        // Fetch User Data
        const userData = await contract.methods.users(userAccount).call();

        setIsExist(userData.isExist);
        setUserId(userData.id);
        setUserReferrerID(userData.referrerID);
        setUserReferredUsers(userData.referredUsers);
        setUserIncome(Number(web3.utils.fromWei(userData.income, "ether")).toFixed(2));
        setUserAutoPoolPayReceived(userData.autoPoolPayReceived);
        setUserLevelIncomeReceived(userData.levelIncomeReceived);

        if (
          userData.autopoolPayReciever !==
          "0x0000000000000000000000000000000000000000"
        ) {
          const receiverData = await contract.methods
            .users(userData.autopoolPayReciever)
            .call();

          setUserAutopoolPayReciever(receiverData.id);
        }

      } catch (error) {
        console.error("Error loading Web3 data:", error);
      }
    }

    loadData();

  }, []); // Run once on mount


  const handleChange = (event) => {
    setReferrerId(event.target.value);
  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!referrerId) return alert("Please enter a Referrer ID");

    try {

      setLoading(true);

      const amount = web3.utils.toWei(registration_Free.toString(), "ether");

      const icuContract = new web3.eth.Contract(ICU.ABI, ICU.address);
      const usdtContract = new web3.eth.Contract(USDT.ABI, USDT.address);

      const allowance = await usdtContract.methods
        .allowance(account, ICU.address)
        .call();

      if (BigInt(allowance) < BigInt(amount)) {
        await usdtContract.methods
          .approve(ICU.address, amount)
          .send({ from: account });
      }

      const receipt = await icuContract.methods
        .Registration(referrerId, amount)
        .send({ from: account });

      alert(receipt.status ? "Registered Successfully!" : "Registration Failed!");

    } catch (error) {

      console.error("Transaction Error:", error);
      alert(error.message || "An error occurred");

    } finally {
      setLoading(false);
    }
  };


  const generateReferralLink = (id) => {
    return `http://localhost:3000?id=${id}`;
  };


  const handleCopied = (e) => {

    e.preventDefault();

    const link = generateReferralLink(userId);

    navigator.clipboard.writeText(link);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };


  return (

    <div className="home-container">

      <div className="col-sm-12 grid-margin">
        <div className="card">
          <div className="card-body-v1 text-center">

            <h5 className="mb-0 address-text">Account Address</h5>

            <h4 className="mb-0 golden-text">
              {account || "0x0000000000000000000000000000000000000000"}
            </h4>

          </div>
        </div>
      </div>


      <div className="row">

        {[
          { label: "Registration Fee", value: `${registration_Free} USDT` },
          { label: "Direct Income", value: `${Number(registration_Free) / 10} USDT` },
          { label: "Current User ID", value: currUserID },
          { label: "Next Reward", value: `${getNextReward} NVP` },
          { label: "Level Income", value: `${level_income} USDT` },
          { label: "Token Price", value: `${tokenPrice} USDT` },
          { label: "User ID", value: userId },
          { label: "Sponsor", value: userReferrerID },
          { label: "Directs", value: userReferredUsers },
          { label: "Total Income", value: `${userIncome} USDT` }
        ].map((item, index) => (

          <div key={index} className="col-lg-4 col-md-6 col-sm-12 grid-margin">

            <div className="card">
              <div className="card-body">

                <h5>{item.label}</h5>
                <h4 className="mb-0 golden-text">{item.value || 0}</h4>

              </div>
            </div>

          </div>

        ))}

      </div>


      <div className="row justify-content-center">

        {!isExist ? (

          <div className="col-sm-12 col-md-6 col-lg-5 grid-margin">

            <div className="card-reg">
              <div className="card-body-reg">

                <h5 className="text-center">Registration</h5>

                <form className="forms-sample" onSubmit={handleSubmit}>

                  <input
                    className="form-control mt-2"
                    type="number"
                    required
                    placeholder="Referrer ID"
                    value={referrerId}
                    onChange={handleChange}
                  />

                  {loading && (
                    <div className="loader-text">
                      Processing Transaction...
                    </div>
                  )}

                  <button
                    className="btn mt-3 submitbtn_ w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Approving..." : "Register Now"}
                  </button>

                </form>

              </div>
            </div>

          </div>

        ) : (

          <div className="col-sm-12 col-md-6 col-lg-5 grid-margin">

            <div className="card-reg">
              <div className="card-body-reg">

                <h5 className="text-center">Your Referral Link</h5>

                <div className="form-group w-100">

                  <input
                    className="form-control mt-2"
                    type="text"
                    value={generateReferralLink(userId)}
                    readOnly
                  />

                  <button
                    className="btn mt-3 submitbtn_ w-100"
                    onClick={handleCopied}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>

                </div>

              </div>
            </div>

          </div>

        )}

      </div>

      <Footer />

    </div>

  );
};

export default Dashboard;
