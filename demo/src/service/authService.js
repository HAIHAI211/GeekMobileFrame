
export function fetchUserToken () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('12345')
        }, 1500)
    })    
}