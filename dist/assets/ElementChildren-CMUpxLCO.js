import{r as n}from"./index-BEj3f1Zo.js";function o(t,a){let e=0;return n.Children.map(t,r=>n.isValidElement(r)?a(r,e++):r)}function s(t,a){let e=0;n.Children.forEach(t,r=>{n.isValidElement(r)&&a(r,e++)})}function f(t,a){return n.Children.toArray(t).some(e=>n.isValidElement(e)&&e.type===a)}export{s as f,f as h,o as m};
