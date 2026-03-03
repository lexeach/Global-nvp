import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, USDT } from "../../utils/web3.js";
import Footer from "../Footer.js";

const Dashboard = () => {
  // Ensure Buffer is available for Web3
  if (!window.Buffer) window.Buffer = Buffer;

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [currUserID, setCurrUserID] = useState();
  const [getNextReward, setGetNextReward] = useState();
  const [level_income, setLevel_income] = useState();
  const [tokenReward, setTokenReward] = useState();
  const [tokenPrice, setTokenPrice] = useState();

  const [userId, setUserId] = useState();
  const [userReferrerID, setUserReferrerID] = useState();
  const [userReferredUsers, setUserReferredUsers] = useState();
  const [userIncome, setUserIncome] = useState();
  const [userAutoPoolPayReceived, setUserAutoPoolPayReceived] = useState();
  const [userMissedPoolPayment, setUserMissedPoolPayment] = useState();
  const [userAutopoolPayReciever, setUserAutopoolPayReciever] = useState();
  const [userLevelIncomeReceived, setUserLevelIncomeReceived] = useState();
  const [userIncomeMissed, setUserIncomeMissed] = useState();
  const [copied, setCopied] = useState(false);
  const [isExist, setIsExist] = useState();
  const [regTime, setRegTime] = useState();

  const [referrerId, setReferrerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const accounts = await web3.eth.requestAccounts();
        if (!accounts || accounts.length === 0) {
          alert("please install metamask");
          return;
        }

        const userAccount = accounts[0];
        setAccount(userAccount);

        let NEW_CBC_ROI = new web3.eth.Contract(ICU.ABI, ICU.address);
        
        let RegistrationFee = await NEW_CBC_ROI.methods.REGESTRATION_FESS().call();
        setRegistrationFee(Number(web3.utils.fromWei(RegistrationFee, "ether")).toFixed(2));

        let currUserId = await NEW_CBC_ROI.methods.currUserID().call();
        setCurrUserID(currUserId);

        let nextRewared = await NEW_CBC_ROI.methods.getNextReward().call();
        setGetNextReward(Number(web3.utils.fromWei(nextRewared, "ether")).toFixed(2));

        let levelIncome = await NEW_CBC_ROI.methods.level_income().call();
        setLevel_income(Number(web3.utils.fromWei(levelIncome, "ether")).toFixed(2));

        let tokenPriceIs = await NEW_CBC_ROI.methods.tokenPrice().call();
        setTokenPrice(Number(web3.utils.fromWei(tokenPriceIs, "ether")).toFixed(2));

        let registTime = await NEW_CBC_ROI.methods.regTime(userAccount).call();
        setRegTime(await epochToDate(registTime));

        let tokenRewardIs = await NEW_CBC_ROI.methods.tokenReward().call();
        setTokenReward(Number(web3.utils.fromWei(tokenRewardIs, "ether")).toFixed(2));

        let users = await NEW_CBC_ROI.methods.users(userAccount).call();
        setIsExist(users.isExist);
        setUserId(users.id);
        setUserReferrerID(users.referrerID);
        setUserReferredUsers(users.referredUsers);
        setUserIncome(Number(web3.utils.fromWei(users.income, "ether")).toFixed(2));
        setUserAutoPoolPayReceived(users.autoPoolPayReceived);
        setUserMissedPoolPayment(users.missedPoolPayment);
        
        let userReceiver = await NEW_CBC_ROI.methods.users(users.autopoolPayReciever).call();
        setUserAutopoolPayReciever(userReceiver.id);
        setUserLevelIncomeReceived(users.levelIncomeReceived);
        setUserIncomeMissed(users.incomeMissed);
      } catch (err) {
        console.error("Load Error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const parsedUrl = new URL(window.location.href);
    const id = parsedUrl.searchParams.get("id");
    if (id) setReferrerId(id);
  }, []);

  async function epochToDate(epochTime) {
    if (!epochTime || Number(epochTime) <= 0) return "00/00/0000";
    const date = new Date(epochTime * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      let amount = web3.utils.toWei(registration_Free.toString(), "ether");
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let USDTTest = new web3.eth.Contract(USDT.ABI, USDT.address);

      let isAllowance = await USDTTest.methods.allowance(account, ICU.address).call();

      if (BigInt(isAllowance) < BigInt(amount)) {
        await USDTTest.methods.approve(ICU.address, amount).send({ from: account });
      }

      const reg_user = await ICU_.methods.Registration(referrerId, amount).send({ from: account });
      if (reg_user.status) {
        alert("Registered Success");
      } else {
        alert("Registered Failed !!!!");
      }
    } catch (e) {
      console.error(e);
      alert("Error caught in transaction");
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (id) => `${window.location.origin}?id=${id}`;

  const handleCopied = (e) => {
    e.preventDefault();
    const link = generateReferralLink(currUserID);
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
              {account ? account : "0x0000000000000000000000000000000000000000"}
            </h4>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Metric Cards */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Registration Fee</h5><h4 className="golden-text">{registration_Free || 0} USDT</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Direct Income</h5><h4 className="golden-text">{registration_Free ? registration_Free / 10 : 0} USDT</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Current User ID</h5><h4 className="golden-text">{currUserID || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Next Reward</h5><h4 className="golden-text">{getNextReward || 0} NVP</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Level Income</h5><h4 className="golden-text">{level_income || 0} USDT</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Token Price</h5><h4 className="golden-text">{tokenPrice || 0} USDT</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Token Reward</h5><h4 className="golden-text">{tokenReward || 0} NVP</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>User ID</h5><h4 className="golden-text">{userId || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Sponsor</h5><h4 className="golden-text">{userReferrerID || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Direct</h5><h4 className="golden-text">{userReferredUsers || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Income</h5><h4 className="golden-text">{userIncome || 0} USDT</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Auto Pool Income</h5><h4 className="golden-text">{userAutoPoolPayReceived || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Missed Pool Payment</h5><h4 className="golden-text">{userMissedPoolPayment || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Autopool Receiver</h5><h4 className="golden-text">{userAutopoolPayReciever || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Level Income Count</h5><h4 className="golden-text">{userLevelIncomeReceived || 0}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Registration Time</h5><h4 className="golden-text">{regTime || "00/00/0000"}</h4></div></div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card"><div className="card-body"><h5>Missed Level Income</h5><h4 className="golden-text">{userIncomeMissed || 0}</h4></div></div>
        </div>
      </div>

      <div className="row justify-content-center">
        {!isExist ? (
          <div className="col-sm-12 col-md-6 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">
                <h5>Registration</h5>
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control mt-2"
                    type="number"
                    required
                    value={referrerId}
                    onChange={(e) => setReferrerId(e.target.value)}
                    placeholder="Referral ID"
                  />
                  {loading && <div className="loader-overlay">Transaction is Processing...</div>}
                  <input className="btn mt-3 submitbtn_" type="submit" disabled={loading} value="Registration" />
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-sm-12 col-md-6 grid-margin">
            <div className="card-reg">
              <div className="card-body-reg">
                <h5 className="text-center">Copy Referral Link</h5>
                <form onSubmit={handleCopied}>
                  <input
                    className="form-control mt-2"
                    type="text"
                    value={generateReferralLink(currUserID)}
                    readOnly
                  />
                  <button className="btn mt-3 submitbtn_" type="submit">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </form>
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
