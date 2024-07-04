import { Loader } from '@mantine/core';
import { BarcodeScanner as Barcode } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';

const BarcodeScanner = ({ onChange }: { onChange: (data: string) => void }) => {
  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden bg-black">
      <Loader
        color="white"
        // type="dots"
        size={20}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <div className="ocrloader top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <em></em>
        <span></span>
      </div>
      <Barcode
        className="relative z-0"
        options={{
          delay: 100,
        }}
        onCapture={(result) => onChange(result.rawValue)}
      />
    </div>
  );
};

export default BarcodeScanner;
