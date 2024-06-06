import Link from 'next/link';

export default function Home() {
  return (
    <div>
        <h1>Survey App</h1>
        <Link href="/viewSurveys">
            View Surveys
        </Link>
        <br />
        <Link href="/createSurvey">
            Create Survey
        </Link>
    </div>
  );
}

// TODO: removing unnecessary imports
// TODO: removing unnecessary code
// TODO: adding styles
// TODO: adding tests
// TODO: configuring CI/CD
// TODO: adding timer
// TODO: adding score
// TODO: adding links from one page to another
// TODO: users should be able to give quizzes
// TODO: make the page responsive
// TODO: make another page for each quizset when the quizset is clicked and taken
// TODO: in the viewQuizSets page, only the quiz name will be shown, and when the quiz is clicked, the quiz will be taken
