"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { ethers, parseEther, parseUnits} from 'ethers'; // 导入 ethers 库
import {ABI, ContractAddress} from '@/constant/abi'

const DepositETH = () => {
  const [amount, setAmount] = useState(''); // 添加状态以存储输入的 ETH 数量
  const [amountERC20, setAmountERC20] = useState(''); // 添加状态以存储输入的 ERC-20 代币数量
  const [result, setResult] = useState(''); // 添加状态以存储输入的 ETH 数量
  const [resultERC20, setResultERC20] = useState(''); // 添加状态以存储输入的 ERC-20 代币数量

  const handleDeposit = async () => {
    if (!amount) return; // 检查输入是否为空
    console.log('start')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.depositETH({ value: parseEther(amount), gasLimit: 210000 }); // 调用合约的 depositETH 方法
      await tx.wait(); // 等待交易确认
      console.log("Deposit successful:", tx);
      setResult('Deposit successful');
    } catch (error) {
      setResult('Deposit failed');
      console.error("Error depositing ETH:", error);
    }
  };

  const handleDepositERC20 = async () => {
    if (!amount) return; // 检查输入是否为空
    console.log('start')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractAddress; // 替换为你的合约地址
      const contractABI = ABI; // 替换为你的合约 ABI
      const tokenAddress = '0x87350147a24099Bf1e7E677576f01C1415857C75'; // 替换为你的usdt代币地址

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.depositERC20(tokenAddress, parseUnits(amountERC20.toString(), 18), {gasLimit: 210000});
      await tx.wait(); // 等待交易确认
      console.log("Deposit successful:", tx);
      setResultERC20('Deposit successful');
    } catch (error) {
      setResultERC20('Deposit failed');
      console.error("Error depositing ETH:", error);
    }
  };

  return (
    <div>
      <h1>2 存入ETH 和 ERC-20代币</h1>
      <Input 
        placeholder='请输入存入的eth数量' 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} // 更新输入状态
      />
      <Button onClick={handleDeposit}>存ETH</Button> {/* 绑定存钱函数 */}
      <Input 
        placeholder='请输入存入的ERC-20代币数量' 
        value={amountERC20} 
        onChange={(e) => setAmountERC20(e.target.value)} // 更新输入状态
      />
      <Button onClick={handleDepositERC20}>存ERC-20代币</Button> {/* 绑定存钱函数 */}
      {/* 展示合约返回的结果 */}
      {result && (
        <div className="mt-4">
          <h2>存入的结果:</h2>
          <p>{result}</p>
        </div>
      )}
      {resultERC20 && (
        <div className="mt-4">
          <h2>存入ERC-20代币的结果:</h2>
          <p>{resultERC20}</p>
        </div>
      )}
    </div>
  )
}

export default DepositETH