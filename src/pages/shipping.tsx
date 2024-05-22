import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
    const { cartItems, total } = useSelector(
        (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    )
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    });

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveShippingInfo(shippingInfo));
        try {
            const { data } = await axios.post(`${server}/api/v1/payment/create`,{
                amount: total
            },{
                headers: {
                    "Content-Type": "application/json",
                }
            });
            navigate("/pay", {
                state: data.clientSecret,
            })
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

    return <div className="shipping">
        <button className="back" onClick={() => navigate("/cart")}>
            <BiArrowBack />
        </button>
        <form onSubmit={submitHandler}>
            <h1>SHIPPING ADDRESS</h1>
            <input
                required
                type="text"
                placeholder="Address"
                name="address"
                value={shippingInfo.address}
                onChange={changeHandler}
            />
            <input
                required
                type="text"
                placeholder="City"
                name="city"
                value={shippingInfo.city}
                onChange={changeHandler}
            />
            <input
                required
                type="text"
                placeholder="State"
                name="state"
                value={shippingInfo.state}
                onChange={changeHandler}
            />
            <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                <option value="">Choose Country</option>
                <option value="india">India</option>
            </select>
            <input
                required
                type="number"
                placeholder="Pin Code"
                name="pinCode"
                value={shippingInfo.pinCode}
                onChange={changeHandler}
            />
            <button type="submit">Pay Now</button>
        </form>
    </div>
}
export default Shipping;