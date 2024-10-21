const Apps = () => {
  return (
    <div className="mt-16 flex flex-col gap-1 text-start">
      <span className="text-3xl font-semibold">Apps</span>
      <span className="mt-2 font-thin text-[#bdbdbd]">Ready to use blockchain dapps</span>
      <div className="mt-5 h-full w-full rounded-md border border-gray-300 p-3 shadow-sm md:w-[500px]">
        <div className="flex flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold">Smart Actions</span>
            <span className="text-sm text-[#868686]">Interact with the blockchain using AI.</span>
          </div>
          <button className="flex h-10 items-center justify-center rounded-md bg-black p-3 text-center">
            <span className="text-white">Open</span>
          </button>
        </div>
        <div className="mt-5 flex w-full flex-row gap-4 rounded-md border border-gray-300 p-3">
          <input
            className="w-full rounded-md border border-gray-300 p-2 outline-none"
            placeholder="Message smart actions"
            onKeyUp={e => {
              if (e.key == 'Enter') {
                console.log('enter');
              }
            }}
          />
          <button className="rounded-full border border-gray-300 p-3 shadow-sm hover:bg-gray-100">
            <img width={20} src="/assets/arrow-up.svg" alt="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Apps;
