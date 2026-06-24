import Child from "./Child";

const Parent = () => {
  const name = "Elon musk";
  const property = "4 SpaceShip";
  return (
    <div>
      <p>Parent</p>
      <h1>{name}</h1>
      <Child property={property}/>
    </div>
  );
};

export default Parent;
