"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ABI, ContractAddress } from '../constant/abi';

const TokenWhiteList = () => {
  const [whiteList, setWhiteList] = useState<string[]>([]);
  const [newToken, setNewToken] = useState<string>('0x87350147a24099Bf1e7E677576f01C1415857C75');

  useEffect(() => {
    fetchWhiteList();
  }, []);

  const fetchWhiteList = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ContractAddress, ABI, provider);
      const list = await contract.getTokenWhiteList();
      setWhiteList(list);
    } catch (error) {
      console.error('Error fetching white list:', error);
    }
  };

  const addTokenToWhiteList = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      const tx = await contract.setTokenWhiteList(newToken, {gasLimit: 210000});
      await tx.wait();
      fetchWhiteList(); // Refresh the list after adding
    } catch (error) {
      console.error('Error adding token to white list:', error);
    }
  };

  return (
    <div>
      <h2>Token White List</h2>
      <ul>
        {whiteList.map((token, index) => (
          <li key={index}>{token}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Token Address"
        value={newToken}
        onChange={(e) => setNewToken(e.target.value)}
      />
      <button onClick={addTokenToWhiteList}>Add Token</button>
    </div>
  );
};

export default TokenWhiteList;