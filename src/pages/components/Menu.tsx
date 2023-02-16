import { useState } from "react";

interface MenuItem {
  name: string;
  id: number;
  active: boolean;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      name: "Home",
      id: 1,
      active: true,
    },
    {
      name: "Top Artists",
      id: 2,
      active: false,
    },
    {
      name: "Top Tracks",
      id: 3,
      active: false,
    }
  ])
  return (
    <div className="bg-black flex flex-row rounded-lg justify-between items-center gap-4 p-4" >
      {menuItems.map((item) => (
        <MenuOption key={item.id} {...item} />
      ))}
    </div>
  )
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
interface MenuOptionProps extends MenuItem {
  onClick?: () => void;
}
const MenuOption = ({ name, active, onClick }: MenuOptionProps) => {
  return (
    <div className={classNames(active ? "bg-white cursor-default" : "bg-black text-white hover:bg-gray-700 duration-200 ease-in-out", "text-center select-none cursor-pointer p-2 font-medium")}
      onClick={onClick}
    >
      {name}
    </div>
  )
}
export default Menu;