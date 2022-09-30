import { useEffect, useState } from "react";

export default function DefaultValues() {
  const [value, setValue] = useState("hello");

  return (
    <>
      <MyInput value={value} />
      <button onClick={() => setValue("goodbye")}>GOODBYE</button>
    </>
  );
}

function MyInput({ value }: { value: string }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>
        <input defaultValue={value} />;
      </p>
      <p>{count}</p>
    </>
  );
}
