import "../Styles/signUpForm.css"

const SignUpForm = () => {
    return(
        <>
           <form action="/submit" method="post" className=" mx-7 mt-4">
                <div className="form-container">
                    <label htmlFor="name" className="form-label">*User Name</label>
                    <input type="text" id="name" name="name" required className="form-field" minLength="3" maxLength="100" placeholder="Aman Singh" />
                </div>
                
                <div className="form-container">
                    <label htmlFor="email" className="form-label">*Email</label>
                    <input type="email" id="email" name="email" required className="form-field" placeholder="aman123@gmail.com" />
                </div>
                
                <div className="form-container">
                    <label htmlFor="password" className="form-label">*Password</label>
                    <input type="password" id="password" name="password" required className="form-field" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?])[A-Za-z\d!@#$%^&*()_\-+=?]{8,16}$" title="Password must be between 8 and 16 characters, contain at least one uppercase and one lowercase letter, contain at least one symbol."/>
                </div>

                <div className="form-container">
                    <label htmlFor="confirm-password" className="form-label">*Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirm-password" required className="form-field" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?])[A-Za-z\d!@#$%^&*()_\-+=?]{8,16}$" title="Password must be between 8 and 16 characters, contain at least one uppercase and one lowercase letter, contain at least one symbol."/>
                </div>
                
                <div className="form-container">
                    <button type="submit" className=" h-9 bg-electric-blue border-[1px] border-electric-blue shadow-md text-white rounded-md">Sign up</button>
                </div>
            </form>
        </>
    )
}

export default SignUpForm;