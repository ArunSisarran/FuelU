"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import TitleComponent from '../components/TitleComponent';
import { useRouter } from 'next/navigation'; 

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter(); 

  const features = [
    "Filter by country or type",
    "Search for specific ingredients",
    "Find meals that fit your schedule and cravings",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === features.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <section className="mission-container">
        <Image
          src="/assets/no2.jpg"
          alt="Healthy food image"
          layout="fill"
          className="mission-background"
          priority
        />

        <div className="mission-content">
          <TitleComponent />
          <p className="mission-text">
            Quick, affordable recipes for every craving. <br />
            No stress - just good food, whenever you need it.
          </p>

          {/* Show only the current feature */}
          <div className="feature-list">
            <ol>
              {features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: currentIndex === index ? 'block' : 'none',
                    opacity: currentIndex === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
                >
                  {feature}
                </li>
              ))}
            </ol>
          </div>

          <button
            className="mission-button"
            onClick={() => {
              router.push('/main'); 
            }}
          >
            Get started
          </button>

          <br />
        </div>
      </section>
    </>
  );
}

export default App;
