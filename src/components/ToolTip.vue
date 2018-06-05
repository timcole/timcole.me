<template>
	<div id="ToolTipContent" :class="direction">
		<div class="container"><slot></slot></div>
	</div>
</template>

<script>
export default {
	name: "ToolTip",
	props: {
		content: String,
		direction: {
			type: String,
			default: "top",
			required: false,
			validator: function (value) {
				return ["streams", "left", "top", "badges"].indexOf(value) != -1
			}
		}
	}
}
</script>

<style lang="scss">
	$background: #363a48;

	#ToolTipContent {
		visibility: hidden;
		opacity: 0;
		color: #fff;
		text-align: center;
		border-radius: 4px;
		z-index: 9999;
		position: absolute;
		background-color: $background;
		-webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
		box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
		
		&.top {
			bottom: 100%;
			left: 50%;
			margin-left: -58px;

			&::after {
				content: "";
				position: absolute;
				top: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: $background transparent transparent transparent;
			}
		}

		&.streams {
			top: 31%;
			right: 100%;

			&::after {
				content: " ";
				position: absolute;
				top: 50%;
				left: 100%;
				margin-top: -99px;
				border-width: 8px;
				border-style: solid;
				border-color: transparent transparent transparent $background;
			}
		}

		&.left {
			top: 2%;
			right: 105%;
			white-space: nowrap;

			&::after {
				content: " ";
				position: absolute;
				top: 50%;
				left: 100%;
				margin-top: -8px;
				border-width: 8px;
				border-style: solid;
				border-color: transparent transparent transparent $background;
			}
		}

		&.badges {
			bottom: -15%;
			right: 150%;
			white-space: nowrap;

			&::after {
				content: " ";
				position: absolute;
				top: 50%;
				left: 100%;
				margin-top: -8px;
				border-width: 8px;
				border-style: solid;
				border-color: transparent transparent transparent $background;
			}
		}
	}

	.ToolTipContainer:hover #ToolTipContent {
		visibility: visible;
		opacity: 1;
		transition: visibility 0s linear 0s, opacity 500ms;
	}
</style>
