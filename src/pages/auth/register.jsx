import Input from "@/components/Input";
import useDoctor from "../api/doctor";
import usePharmacist from "../api/pharmacist";
import { useState } from "react";

export default function Login() {
    const { addDoctor } = useDoctor();
    const { addPharmacist } = usePharmacist();
    const [error, setError] = useState(null);
    const [input, setInput] = useState({});

    const inputHandler = (e) => {
        const { name, type, checked, value } = e.target;
        setInput(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const RegisterHandler = async (e) => {
        e.preventDefault()
        try {
            console.log(input);
            // TODO: check if the role is eather doctor or pharmacist
            const response = await addDoctor(input)
            typeof response === "string" ? console.log(response) : setError(response.message)
        } catch (error) {
            console.log("error: ", error);
        }
    }

    return (
        <>
        <form onSubmit={RegisterHandler}  className="container flex justify-center items-center flex-col h-screen">
                <section>
                    <div className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                        <div>
                            <h3>Create Your Account</h3>
                            <p>Create new account to access the pharmacy dashboard</p>
                        </div>
                        <div>
                            <p>Email</p>
                        <Input type='email' placeholder='johndoe@gmail.com' name="email" onChange={inputHandler}/>
                        </div>
                        <div>
                            <p>password</p>
                            <input type='password' placeholder='**********' name="password" onChange={inputHandler}/>
                        </div>
                        <div>
                            <p>Confirm password</p>
                            <input type='password' placeholder='**********' name="confirm-password" onChange={inputHandler}/>
                        </div>
                        <button type='button' className='w-full'>Next</button>
                    </div>
                </section>

                {/* <section>
                    <div className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                        <div>
                            <h3>You are almost done</h3>
                            <p>Please fill the data bellow</p>
                        </div>
                        <div>
                            <p>NIK</p>
                        <Input type='text' placeholder='johndoe@gmail.com' name="nik"/>
                        </div>
                        <div className="flex gap-5">
                            <div>
                                <p>First Name</p>
                                <input type='text' placeholder='**********' name="firstName"/>
                            </div>
                            <div>
                                <p>Last Name</p>
                                <input type='text' placeholder='**********' name="lastName"/>
                            </div>
                        </div>
                        <div>
                            <p>Phone Number</p>
                            <input type='number' placeholder='**********' name="lastName"/>
                        </div>
                        <div>
                            <p>Date of Birth</p>
                            <input type='date' placeholder='**********' name="lastName"/>
                        </div>
                        <div>
                            <div>Role section goes here</div>
                        </div>
                        <div id="specialist">
                            <p>Specialist</p>
                            <input type='text' placeholder='**********' name="lastName"/>
                        </div>
                        <div className="w-full">
                            <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat"></input>
                            <label for="vehicle2"> Keep Me Sign In</label>
                        </div>
                        <button type='submit' className='w-full'>Login</button>
                    </div>
                </section> */}

        </form>
        </>
    )
}