import Link from 'next/link';

const NavigateButton = ({ page }) => {
   
    let pageName = page;
    if (page.includes("/")) {
        const parts = page.split("/");
        pageName = parts[parts.length - 1];
    } else {
        pageName = page;
    }

    return (
        <Link href={`/${page}`}>
            <button className="bg-gray-600 font-medium text-[30px] text-white px-20 py-5 rounded-md">
                {pageName} 
            </button>
        </Link>
    );
};

export default NavigateButton;
