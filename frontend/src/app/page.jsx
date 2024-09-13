import { styles } from '../style';
import  NavigateButtom  from '../components/NavigateButton';

const Home = () => {

  return (
    <section className={`${styles.padding} max-w-7xl mx-auto relative`}>

      <h1 className={`${styles.heroHeadText}`}>
        LetsChat
        <br className='max-md:hidden'/>
        <span className='orange_gradient text-center'> AI-Powered Networking</span>
      </h1>

      <div 
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
      className='py-40'>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NavigateButtom page='auth/login' />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NavigateButtom page='auth/register' />
        </div>

      </div>

    </section>
  );
};

export default Home;
