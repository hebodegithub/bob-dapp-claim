"use client"
import WalConnect from "../component/WalConnect";
import QueryAirdrop from "@/component/QueryAirdrop";
import DepositETH from "@/component/DepositETH";
import WithdrawETH from "@/component/WithdrawETH";
import GrantRewards from "@/component/GrantRewards";
import TokenWhiteList from "@/component/TokenWhiteList";
import { useState } from 'react';

export default function Home() {
  const [activeComponent, setActiveComponent] = useState('query'); // 默认显示查询页面

  // 菜单配置
  const menuItems = [
    { id: 'query', name: '查询空投', component: <QueryAirdrop /> },
    { id: 'deposit', name: '存入ETH', component: <DepositETH /> },
    { id: 'withdraw', name: '提现ETH', component: <WithdrawETH /> },
    { id: 'grant', name: '发放奖励', component: <GrantRewards /> },
    { id: 'whitelist', name: '代币白名单', component: <TokenWhiteList /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo或标题 */}
            <div className="text-xl font-bold">
              DApp Dashboard
            </div>

            {/* 连接钱包按钮 */}
            <div>
              <WalConnect />
            </div>
          </div>
        </div>
      </header>

      {/* 菜单栏 */}
      <nav className="bg-white shadow-sm fixed w-full top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 h-12">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveComponent(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors
                  ${activeComponent === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 显示当前选中的组件 */}
            {menuItems.find(item => item.id === activeComponent)?.component}
          </div>
        </div>
      </main>
    </div>
  );
}