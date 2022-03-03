import React, { Fragment, useContext, useRef } from "react";
// images and/or icons
import Logo from "../../Assets/Images/logo.png";
import Menu from "../../Assets/Icons/menu.png";
import Search from "../../Assets/Icons/search.png";
import Cart from "../../Assets/Icons/cart.svg";
import ArrowLeft from "../../Assets/Icons/arrow-left.svg";

import { HeaderProps } from "./types";

// components
import { SearchInput } from "../../Components/SearchInput";
import { ButtonSmall } from "../../Components/ButtonSmall";

// constants
import { locationRegex } from "../../constants";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Filter } from "../Filter";

export const Header: React.FC<HeaderProps> = ({ dispatch, ctx }): JSX.Element => {
  const navigate: NavigateFunction = useNavigate()
  const state = useContext(ctx)
  let { current, shoppingCart, history, isSearching, searching } = state
  
  const searchDesktopRef = useRef<HTMLInputElement>(null)
  const handleSearch = (): void => dispatch({ type: "SEARCH" })
  const handleSearchDesktop = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SEARCHING", payload: e.target.value })
  }
  current = current.length > 1 ? current.match(locationRegex)?.join(" ") as string : current

  React.useEffect(() => {
    if(searching && searchDesktopRef.current){
      searchDesktopRef.current.focus()
    } 
  }, [searching])

  const renderMainHeader = (): JSX.Element => {
    if(isSearching){
      return(
        <SearchInput dispatch={dispatch} ctx={ctx}/>
      )
    }else{
      return(
        <React.Fragment>
          <button className="Header__logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="" />
          </button>

          <nav className="Header__buttons-container">
            <ButtonSmall source={Search} onclick={handleSearch} />

            <ButtonSmall
              to="/menu"
              dependencies={shoppingCart.length}
              source={Menu}
              dispatch={dispatch}
            />
          </nav>

          <nav className="Header__desktop">
            {(window.location.pathname === "/") ? (
              <Fragment>
                <div className="Header__search-field">
                  <label htmlFor="search">
                    <img src={Search} alt="" />
                  </label>

                  <input 
                    ref={searchDesktopRef}
                    type="text"
                    id="search"
                    placeholder="Search..."
                    onChange={handleSearchDesktop}
                    defaultValue={searching}
                  />
                </div>
              </Fragment>
            ) : (
              <Filter
                dispatch={dispatch}
                ctx={ctx}
                isInHeader={true}
              />
            )}

            {window.location.pathname !== "/shopping-cart" && (
              <button
                className="Header__cart"
                onClick={() => navigate("shopping-cart")}
              >
                <span>Cart</span>
                <img src={Cart} alt="" />
                {(shoppingCart.length > 0) && (
                  <span className="Header__cart--notification"></span>
                )}
              </button>
            )}
          </nav>
        </React.Fragment>
      )
    }
  }

  return (
    <header className="Header">
      {current.length > 1 ? (
        <React.Fragment>
          <ButtonSmall
            to={history}
            source={ArrowLeft}
            isCTA={true}
            dispatch={dispatch}
          />

          <h2 className="Header__title">
            {current}
          </h2>
        </React.Fragment>
      ) : (
        renderMainHeader()
      )}
    </header>
  )
}