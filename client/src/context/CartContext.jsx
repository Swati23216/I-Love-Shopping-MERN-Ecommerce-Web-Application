import {createContext,useContext,useEffect,useState} from 'react';
const CartContext=createContext();
export function CartProvider({children}){
 const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('cart')||'[]'));
 useEffect(()=>localStorage.setItem('cart',JSON.stringify(cart)),[cart]);
 const addToCart=(product)=>setCart(c=>{const x=c.find(i=>i.product===product._id);return x?c.map(i=>i.product===product._id?{...i,qty:i.qty+1}:i):[...c,{product:product._id,name:product.name,price:product.price,image:product.image,qty:1,stock:product.stock}]});
 const removeFromCart=id=>setCart(c=>c.filter(i=>i.product!==id));
 const updateQty=(id,qty)=>setCart(c=>c.map(i=>i.product===id?{...i,qty:Math.max(1,Math.min(qty,i.stock))}:i));
 const clearCart=()=>setCart([]);
 const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
 return <CartContext.Provider value={{cart,addToCart,removeFromCart,updateQty,clearCart,total}}>{children}</CartContext.Provider>
}
export const useCart=()=>useContext(CartContext);