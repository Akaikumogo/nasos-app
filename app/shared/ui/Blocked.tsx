import { Lock } from 'lucide-react';

const Blocked = ({ icon = true }: { icon?: boolean }) => {
  return (
    <div className="absolute inset-0 z-100 flex h-full w-full items-center justify-center blocked">
      <div className="flex flex-col items-center">
        {icon && <Lock className=" text-black " />}
        {/* <span className="font-semibold text-black">Blocked</span> */}
      </div>
    </div>
  );
};

export default Blocked;
