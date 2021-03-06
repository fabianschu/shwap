import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { address, abi } from "../deployments/TradeHub.json";

const AddProposal = () => {
  const [proposerAddress, setProposerAddress] = useState("");
  const [proposerId, setProposerId] = useState("");
  const [counterpartAddress, setCounterpartAddress] = useState("");
  const [counterpartId, setCounterpartId] = useState("");
  const { account, library, active } = useWeb3React();

  const handleClick = async () => {
    const {
      functions: { listProposal },
    } = new Contract(address, abi, library.getSigner());

    await listProposal(
      proposerAddress,
      counterpartAddress,
      proposerId,
      counterpartId
    );
  };

  return active ? (
    <div>
      <input
        value={proposerAddress}
        onChange={(e) => setProposerAddress(e.target.value)}
        placeholder="Proposed token address"
      />
      <input
        value={proposerId}
        onChange={(e) => setProposerId(e.target.value)}
        placeholder="Proposed token id"
        type="number"
      />
      <input
        value={counterpartAddress}
        onChange={(e) => setCounterpartAddress(e.target.value)}
        placeholder="Counterpart token address"
      />
      <input
        value={counterpartId}
        onChange={(e) => setCounterpartId(e.target.value)}
        placeholder="Counterpart token id"
        type="number"
      />
      <button onClick={handleClick}>Add</button>
    </div>
  ) : null;
};

export default AddProposal;
