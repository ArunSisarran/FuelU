"use client";
import { useState } from "react";
import Image from 'next/image';
import TitleComponent from '../components/TitleComponent';

function App() {

  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    kosher: false,
    halal: false,
    glutenFree: false,
    dairyFree: false,
    none: false,
  });

  const [allergyPreferences, setAllergyPreferences] = useState({
    nuts: false,
    eggs: false,
    shellfish: false,
    soy: false,
    none: false
  });

  //function that checks if at least one option from each section is selected
  function isFormValid(dietaryPreferences, allergyPreferences) {
    const dietarySelected = Object.values(dietaryPreferences).some(val => val === true);
    const allergiesSelected = Object.values(allergyPreferences).some(val => val === true);
    return dietarySelected && allergiesSelected;
  }

  return (
    <div>
      {/* Mission Section */}
      <section className="mission-container">
        <div className="mission-left">
          <TitleComponent />
          <div className="mission-text-block">
            <p className="mission-text">
              Welcome to FuelU – Fueling Your Health and Success in College!
              Eating healthy in college often feels like a choice between expensive meal plans or long hours 
              spent cooking after a tiring day. But what if there was an easier way? At FuelU, we’ve 
              designed a platform just for you. Whether you’re looking for quick meals, satisfying desserts, 
              or refreshing drinks, our recipe recommendations are tailored to your needs. No complicated grocery lists, no long prep times—just healthy, easy meals to fuel 
              your day!
            </p>

            <ol>
                <li>🍴 Filter by dietary restrictions</li>
                <li>⏱️ Sort by prep time or ingredients</li>
                <li>🍽️ Discover delicious options that fit into your busy college life</li>
            </ol>

            <button 
              className="survey-button" 
              onClick={() => document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Let’s get started and find your perfect recipe!
            </button>

            <br />

            {/* Placeholder for future functionality to navigate to recipes page */}
            <button 
              className="survey-button"
              onClick={() => {
                // Add navigation logic here
                console.log('Go to next page');
              }}
            >
              Go to Recipes
            </button>
          </div>
        </div>

        {/* Salmon image */}
        <div className="mission-right">
          {/* Placeholder image for now */}
          <Image 
            src="/assets/bgdremove.png" 
            alt="Healthy food image" 
            width={500} 
            height={300} 
            className="mission-image" 
            />

        </div>
      </section>


      {/* Survey Section */}
      <section id="survey-section" className="survey-section">
        <section>
          <h2>Dietary Restrictions</h2>
          {/* Vegetarian Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.vegetarian}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  vegetarian: e.target.checked,
                  none: false,
                }))
              }
            />
            Vegetarian
          </label>

          <br />

          {/* Vegan Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.vegan}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  vegan: e.target.checked,
                  none: false,
                }))
              }
            />
            Vegan
          </label>

          <br />

          {/* Kosher Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.kosher}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  kosher: e.target.checked,
                  none: false,
                }))
              }
            />
            Kosher
          </label>

          <br />

          {/* Halal Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.halal}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  halal: e.target.checked,
                  none: false,
                }))
              }
            />
            Halal
          </label>

          <br />

          {/* Glutenfree Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.glutenFree}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  glutenFree: e.target.checked,
                  none: false,
                }))
              }
            />
            Gluten Free
          </label>

          <br />

          {/* Dairyfree Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.dairyFree}
              onChange={(e) =>
                setDietaryPreferences((prev) => ({
                  ...prev,
                  dairyFree: e.target.checked,
                  none: false,
                }))
              }
            />
            Dairy Free
          </label>

          <br />

          {/* None Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={dietaryPreferences.none}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setDietaryPreferences({
                  vegetarian: false,
                  vegan: false,
                  kosher: false,
                  halal: false,
                  glutenFree: false,
                  dairyFree: false,
                  none: isChecked,
                });
              }}
            />
            None
          </label>
        </section>

        <br />

        <section>
          <h2>Allergies</h2>

          {/* Nuts Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={allergyPreferences.nuts}
              onChange={(e) =>
                setAllergyPreferences((prev) => ({
                  ...prev,
                  nuts: e.target.checked,
                  none: false,
                }))
              }
            />
            Nuts
          </label>

          <br />

          {/* Eggs Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={allergyPreferences.eggs}
              onChange={(e) =>
                setAllergyPreferences((prev) => ({
                  ...prev,
                  eggs: e.target.checked,
                  none: false,
                }))
              }
            />
            Eggs
          </label>

          <br />

          {/* Shellfish Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={allergyPreferences.shellfish}
              onChange={(e) =>
                setAllergyPreferences((prev) => ({
                  ...prev,
                  shellfish: e.target.checked,
                  none: false,
                }))
              }
            />
            Shellfish
          </label>

          <br />

          <label>

          {/* Soy Checkbox */}
            <input
              type="checkbox"
              checked={allergyPreferences.soy}
              onChange={(e) =>
                setAllergyPreferences((prev) => ({
                  ...prev,
                  soy: e.target.checked,
                  none: false,
                }))
              }
            />
            Soy
          </label>

          <br />

          {/* None Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={allergyPreferences.none}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setAllergyPreferences({
                  nuts: false,
                  eggs: false,
                  shellfish: false,
                  soy: false,
                  none: isChecked,
                });
              }}
            />
            None
          </label>
        </section>

        <br />

        {/* Submit button that is disabled until at least one option from each section is selected */}
        <button
          onClick={() => {
            console.log(dietaryPreferences, allergyPreferences);
          }}
          disabled={!isFormValid(dietaryPreferences, allergyPreferences)}
        >
          Submit
        </button>
      </section>
    </div>
  );
}

export default App;
