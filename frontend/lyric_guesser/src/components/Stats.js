import thumbsUp from '../images/thumbsUp.gif'
import surprise from '../images/surprise.gif'
import shrug from '../images/shrug.gif'
function Stats(props) {
    function gifRender() {
        if (props.stats.numCorrect / props.stats.numSongs >= .7) {
            return (
                <div>
                    <p>
                        <b>You Passed!</b>
                    </p>
                    <img src={thumbsUp} alt="gif"/>
                </div>
            )
        }
        else if (props.stats.numCorrect / props.stats.numSongs >= .4){
            return (

                <div>
                    <p>
                        <b>You Could do Better</b>
                    </p>
                    <img src={shrug} alt="gif"/>
                </div>
            )
        }
        return (

            <div>
                <p>
                    <b>Taylor is Disappointed :(</b>
                </p>
                <img src={surprise} alt="gif"/>
            </div>
        )
    }
    let gif = gifRender();
    return(

        <div>
            <p>Thanks For Playing!</p>
            <p>Questions Answered: {props.stats.numSongs}</p>
            <p>Correct Answers: {props.stats.numCorrect}</p>
            <p>You Answered {100 * props.stats.numCorrect / props.stats.numSongs }% of the Questions Right</p>
            <p>Refresh to Play Again!</p>
            {gif}
        </div>
    )
}
export default Stats;