// 2 + 2 * 9

expr
	= logical

logical
	= left:equality op:("&&" / "||") _ right:logical {return{left,op,right} }
	/ equality

equality
	= left:relational op:("==" / "!=") _ right:equality {return{left,op,right}}
	/ relational

relational
	= left:additive op:(">=" / "<=" / ">" / "<") _ right:relational {return{left,op,right}}
	/ additive

additive 
	= left:multiplicative op:("+" / "-") _ right:additive {return{left,op,right}}
	/ multiplicative

multiplicative
	= left:grouping op:("*" / "/") _ right:multiplicative {return{left,op,right}}
	/ grouping

grouping 
	= "(" _ expr:expr ")" _ {return expr}
	/ primary

primary 
	= boolean 
	/ integer
	/ string
	/ variable 
	
string
	= '"' chars:char* '"' _ {return {type:"string", value: chars.join("")}}

char = [^"]

integer 
	= digits:[0-9]+ _ {return {type: "int", value: digits.join("")}}

boolean 
	= value:("true" / "false") _ {return {type: "bool", value}}

variable
	= first:[a-zA-Z] rest:[a-zA-Z0-9_]* _ {
		return {type: "var", value: [first, ...rest].join("")}
	}

_   = [ \t\r\n]*
__  = [ \t\r\n]+
