import {
    Header, 
    Logo,
    Hero,
    Button,
    Features,
    Categories,
    BestSellers,
    Testimonals,
    Contact,
    FAQSection,
    Footer,
    WhatsappBtn,} from '../components/index'
    import '../styles/index.css';

function Home(){
    return (
        <>
        <Header />
        <Hero />
        <Features />
        <BestSellers />
        <Categories />
        <Testimonals />
        <FAQSection />
        <Contact />
        <Footer />
        </>
    )

}

export default Home;