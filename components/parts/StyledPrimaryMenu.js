
import React from 'react'
import styled from 'styled-components'
import { breakpoints, fonts, sizes, colors, mixins } from '../css-variables'
import FbIcon from "../../src/svg/fb_icon_gray.svg" // Tell webpack this JS file uses this image
import TwIcon from "../../src/svg/twitter_icon_gray.svg" // Tell webpack this JS file uses this image
import IgIcon from "../../src/svg/instagram_icon_gray.svg" // Tell webpack this JS file uses this image
import WcIcon from "../../src/svg/wechat_icon_gray.svg" // Tell webpack this JS file uses this image
import LiIcon from "../../src/svg/linkedin_icon_gray.svg" // Tell webpack this JS file uses this image


const StyledPrimaryMenu = styled.div`
.primarymenu {
    position: fixed;
    top: 118px;
    left: 0;
    height: 100%;
    width: 100%;
    background: #ffffff;
    z-index: 1031;
    visibility: hidden;
    opacity: 0;
    transition: all 0.35s;
    cursor: pointer;
    padding: 0;
    @media screen and ${breakpoints.tabletS} {
        padding: 0 60px;
    }
    @media screen and ${breakpoints.laptopS} {
        padding: 0 180px;
    }
    &.open {
        visibility: visible;
        opacity: 1;
    }
    .topNav {
        height: 80px;
    }
    .mainNav {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-width: 320px;
        
        > div {
            &:first-of-type {
                width: calc(100% - 72px);
                max-width: 299px;
                margin: 0 auto;

                
                @media screen and ${breakpoints.tabletS} {
                    width: 396px;
                }
                
               
            }
            &:last-of-type {
                display: none;
                width: 60%;
                @media screen and ${breakpoints.tabletS} {
                    display: block;
                }
            }
        }
        ul.primary li,
        ul.secondary li {
            
            &:hover {
                background-color: ${colors.navcardGrey};
            }
            
            
        }

    }
    
    a {
        pointer-events: all;
    }
    .primary {
        margin: 0;
        list-style-type: none;
        font-size: ${sizes.s22};
        padding-bottom: ${sizes.s24};
        border-bottom: 1px solid ${colors.navMenuBorderGrey};

        @media screen and ${breakpoints.tabletS} {
            font-size: ${sizes.s26};
            
            border-right: 1px solid ${colors.navMenuBorderGrey};
        }
        li {
            width: auto;
            position: relative;
            //margin-bottom: ${sizes.s32};
            margin: 0;
            padding: ${sizes.s16} 0;
            @media screen and ${breakpoints.tabletS} {
                padding: ${sizes.s24} 0 ${sizes.s24} ${sizes.s12};
            }
            span {
                position: relative;
                &:after {
                    position: absolute;
                    content: '';
                    right: -${sizes.s32};
                    top: calc(50%  - 3px);
                    width: 0;
                    height: 0;
                    border-top: 6px solid transparent;
                    border-left: 12px solid ${colors.badgerRed};
                    border-bottom: 6px solid transparent;
    
                }

            }
            &:hover {
                color: ${colors.badgerRed};
                span {
                    &:after {
                        right: -${sizes.s42};
                    }
                }
            }
            @media screen and ${breakpoints.tabletS} {
                padding-left: ${sizes.s16};
            }
            
        }
        

    }
    .secondary {
        display: none;
        list-style-type: none;
        li {
            padding: ${sizes.s16} ${sizes.s32} ${sizes.s16} ${sizes.s42};
        }
        &.open {
            display: block;
            position: absolute;
            left: 300px;
            padding-left: 24px;

            top: 0;
            li {
                margin-left: ${sizes.s36};

            }
            
        }
        a {
            text-decoration: none;
            color: ${colors.navMenuBlack};
        }
    }
    .supplemental {

        list-style-type: none;
        padding: ${sizes.s32} 0;
        margin: 0;
        @media screen and ${breakpoints.tabletS} {
            padding: ${sizes.s32} 0;
            border-right: 1px solid ${colors.navMenuBorderGrey};
        }
        li {
            margin: 0;
            //margin-bottom: ${sizes.s32};
            
        }
        li {
            padding: ${sizes.s16} 0;
            @media screen and ${breakpoints.tabletS} {
                padding: ${sizes.s16} 0 ${sizes.s16} ${sizes.s16};
            }
            
        }
        a {
            text-decoration: none;
            color: ${colors.navMenuBlack};
            &:hover {
                color: ${colors.hoverRed};
            }
        }
        



    }
    .socialLinks {
        width: 160px;
        display: flex;
        list-style-type: none;

        margin: 0;
         
        li {
            display: block;
            width: ${sizes.s24};
            height: ${sizes.s24};
            margin: 0 ${sizes.s16} 0 0;
               
            a {
                display: block;
                width: ${sizes.s24};
                height: ${sizes.s24};
                background-color: ${colors.iconGrey};
                &:hover {
                    background-color: ${colors.buttonRed};
                }
                &.fb {
                    mask: url(${FbIcon});
                }
                &.tw {
                    mask: url(${TwIcon});
                }
                &.ig {
                    mask: url(${IgIcon});
                }
                &.wc {
                    mask: url(${WcIcon});
                }
                &.li {
                    mask: url(${LiIcon});
                }

                
            }
        }
    }
}


`
export default StyledPrimaryMenu

