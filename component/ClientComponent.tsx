"use client"; // 指定这是一个客户端组件

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getDefaultConfig } from '@rainbow-me/rainbowkit'; // 导入 getDefaultConfig
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  holesky
} from 'wagmi/chains';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient(); // 创建 QueryClient 实例

const ClientComponent = ({ children}: any) => {
  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, polygon, optimism, arbitrum, base, holesky],
    ssr: false, // 如果您的 dApp 使用服务器端渲染 (SSR)
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ClientComponent;