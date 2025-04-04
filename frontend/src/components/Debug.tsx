import { FC } from 'react';

interface DebugProps {
  wallet: {
    address: string | null;
    provider: any;
    signer: any;
  };
  metadataUrl: string | null;
  isGenerating: boolean;
  isMinting: boolean;
  error: string | null;
}

const Debug: FC<DebugProps> = ({ wallet, metadataUrl, isGenerating, isMinting, error }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs font-mono">
      <h3 className="text-[#ADFF2F] mb-2">Debug Info</h3>
      <pre>
        {JSON.stringify({
          wallet: {
            connected: !!wallet.address,
            address: wallet.address,
            hasProvider: !!wallet.provider,
            hasSigner: !!wallet.signer,
          },
          metadataUrl: !!metadataUrl,
          isGenerating,
          isMinting,
          error
        }, null, 2)}
      </pre>
    </div>
  );
};

export default Debug;