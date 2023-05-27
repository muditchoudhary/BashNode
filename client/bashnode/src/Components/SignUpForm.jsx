import "../Styles/signUpForm.css"

const SignUpForm = () => {
    return(
        <>
           <form action="/submit" method="post" className=" mx-7 ">
                <div className="form-container">
                    <label htmlFor="name" className="form-label">User Name</label>
                    <input type="text" id="name" name="name" required className="form-field" />
                </div>
                
                <div className="form-container">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email" required className="form-field" />
                </div>
                
                <div className="form-container">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" name="password" required className="form-field"/>
                </div>
                
                <div className="form-container">
                    <button type="submit"></button>
                </div>
            </form>
        </>
    )
}

export default SignUpForm;