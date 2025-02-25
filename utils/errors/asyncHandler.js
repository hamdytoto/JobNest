export const asyncHandler = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((error) =>{
			// check if error was empty 
			if(Object.keys(error) === 0){
				next ( new Error (error.message) );
			}
			return next(error);
		} );
	};
};
