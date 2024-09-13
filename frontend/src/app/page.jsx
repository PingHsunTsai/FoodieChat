import { styles } from '../style';
import  NavigateButtom  from '../components/NavigateButton';

const Home = () => {

  return (
    <section>
      
      <h1 className='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2'>
        LetsChat
        <br className='max-md:hidden'/>
        <span className='text-center'> AI-Powered Networking</span>
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
