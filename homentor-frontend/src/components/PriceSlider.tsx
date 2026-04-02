// components/PriceSlider.tsx
import * as Slider from "@radix-ui/react-slider";

const PriceSlider = ({ value, onChange }: {
  value: number[];
  onChange: (val: number[]) => void;
}) => {
  return (
    <div className="w-full ">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-6"
        min={0}
        max={20000}
        step={100}
        value={value}
        onValueChange={onChange}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[6px]">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <Slider.Thumb className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </Slider.Root>
    </div>
  );
};

export default PriceSlider;
