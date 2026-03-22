import { useNavigate } from "react-router-dom";
import { Interface_Button } from "../assets/ui/Interface_Button";
 

export function StudentUploadInterface(): React.JSX.Element {
    const navigate = useNavigate()

    const submitFileConfirmation = (): void => {
    // This should check to see if the file has been submitted, and verified
    // will return 0 for failure, 1 for true
    alert("You have submitted the file")
    }

    return(
        <>
            <div style={{ padding: '8rem'}}>
                <h1>Student Upload Interface Page</h1>

                <div className="text-submission">
                    <h1>Project Code Submission</h1>
                </div>

                <div>
                <h5>This will be a button to handle the upload once implemented </h5>
                </div>

                
                <Interface_Button onClick={submitFileConfirmation}>
                    Submit Code
                </Interface_Button>

                <button onClick={ () => navigate('/')} style={{ marginLeft: '1rem'}}>
                    Go to Home
                </button>
            </div>       
        </>
    )

}

export default StudentUploadInterface