
import Design from './Design';
    import '../styles/index.css';

function Home(){
    // useEffect(() => {
    //     fetch('http://127.0.0.1:8000/api/medical/company')
    //       .then((res) => res.json())
    //       .then((data) => console.log(data))
    //       .catch((err) => console.error('Fetch error:', err));
    //   }, []);
    return (
        <>
        <Design />
        </>
    )

}

export default Home;