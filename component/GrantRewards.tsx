"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { ethers, parseEther, parseUnits} from 'ethers'; // 导入 ethers 库
import {ABI, ContractAddress} from '@/constant/abi'

const GrantRewards = () => {
  const [result, setResult] = useState(''); // 添加状态以存储输入的 ETH 数量
  const [amount, setAmount] = useState(''); // 添加状态以存储输入的金额
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>(ContractAddress);

  const getWalletAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // 设置钱包地址
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
  };

  // 在组件挂载时获取钱包地址
  useEffect(() => {
    getWalletAddress();
  }, []);

  const grantRewards = async (tokenAddress: string, granter: string, amount: string) => {
    console.log(tokenAddress, granter, amount)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI
  
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.grantRewards(
        tokenAddress,
        granter,
        parseUnits(amount, 18), // 假设代币有18位小数
        {gasLimit: 210000}
      );
      await tx.wait(); // 等待交易确认
      console.log("Rewards granted successfully:", tx);
      setResult('Rewards granted successfully');
    } catch (error) {
      console.error("Error granting rewards:", error);
      setResult('Error granting rewards');
    }
  };

  
  return (
    <div>
      {/* 合约地址 */}
      <Input type="text" placeholder="Token Address" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
      {/* 取钱管理者 */}
      <Input type="text" placeholder="Granter" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
      {/* 金额 */}
      <Input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button onClick={() => grantRewards(contractAddress, walletAddress, amount)}>Grant Rewards</Button>
      
      {result && (
        <div className="mt-4">
          <h2>Grant Rewards 的结果:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

export default GrantRewards
