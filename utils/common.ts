import { User } from "../api/User/User";
import { Business } from "../api/Business/Business";

export function capitalize(text: string) {
  if (typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function validateNumber(value: string) {
  var isNumberRegex = /[0-9]|\./;
  return value !== '' ? isNumberRegex.test(value) : true;
}

export function clearUser(context: any, localStorage?: any) {
  if (context) {
    context.cookie.remove('user');
  }
  if (localStorage) {
    localStorage.removeItem('user');
  }
}

export function setUser(user: User, context?: any, localStorage?: any) {
  if (context) {
    context.cookie.set('user', user);
  }
  if (localStorage) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getUser(context?: any, localStorage?: any) {
  try {
    if (!context) {
      if (localStorage) {
        const user = localStorage.getItem('user');
        if (user) {
          return JSON.parse(user) as User;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
    const user_json = context.cookie.get('user');
    if (user_json) {
      return user_json as User;
    }
    return null;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export function doLogout(context?: any, localStorage?: any) {
  if (context) {
    try {
      context.cookie.remove('user');
    } catch (error) {
      console.log(error.message);
    }
  }
  if (localStorage) {
    localStorage.removeItem('user');
  }
}

export function getSelectedBusiness(localStorage?: any) {
  if (localStorage) {
    const business = localStorage.getItem('business');
    if (business) {
      return JSON.parse(business) as Business;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function clearSelectedBusiness(localStorage?: any) {
  if (localStorage) {
    localStorage.removeItem('business');
  }
}

export function setSelectedBusiness(business: Business, localStorage?: any) {
  if (localStorage) {
    localStorage.setItem('business', JSON.stringify(business));
  }
}

export function formatMoney(number: any, decPlaces?: number, decSep?: string, thouSep?: string) {
  decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
  thouSep = typeof thouSep === "undefined" ? "," : thouSep;
  let sign = number < 0 ? "-" : "";
  let i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
  let j = (i.length) > 3 ? i.length % 3 : 0;

  return sign +
    (j ? i.substr(0, j) + thouSep : "") +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
    (decPlaces ? decSep + Math.abs(number - Number(i)).toFixed(decPlaces).slice(2) : "");
}

/**
* Returns an array with arrays of the given size.
*
* @param anArray {Array} array to split
* @param chunk_size {Integer} Size of every group
*/
export function chunkArray(anArray: any, chunk_size: number, fixedSize = false) {
  let index = 0;
  let arrayLength = anArray.length;
  let tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = anArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    if (myChunk.length < 5 && fixedSize) {
      const fillNumber = chunk_size - myChunk.length;
      for (let innerIndex = 0; innerIndex < fillNumber; innerIndex++) {
        myChunk.push(null);
      }
    }
    tempArray.push(myChunk);
  }
  return tempArray;
}