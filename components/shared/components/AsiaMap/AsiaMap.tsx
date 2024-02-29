import * as d3 from "d3";
import React, { useEffect, useMemo } from "react";
import textures from "textures";
import styles from "./AsiaMap.module.scss";

export const AsiaMap: React.FC<{ highlightedCountries: string[] }> = ({ highlightedCountries }) => {
  const mapRef = React.useRef<null | SVGSVGElement>(null);

  const t = useMemo(
    () => textures.lines().strokeWidth(1).stroke("black").background("#fafafa").size(3),
    [],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Select all children of root g element
      const countries = Array.from(map.querySelectorAll("svg > g > *"));
      console.log(countries);
      countries.forEach((country) => {
        if (highlightedCountries.includes(country.id)) {
          country.setAttribute("fill", t.url());
        } else {
          country.removeAttribute("fill");
        }
      });
    }
  }, [highlightedCountries, mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Clear defs
      d3.select(map).select("defs").remove();
      const svg = d3.select(map);
      svg.call(t);
    }
  }, [mapRef, t]);

  return (
    <svg
      ref={mapRef}
      className={styles.map}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="534.80899 407.713989 172.527008 155.494019"
      id="world-map"
    >
      <g>
        <path
          id="ae"
          d="M528.466,468.135l0.753,3.008l8.522,0.752l0.596-6.172l1.644-0.897l0.448-2.257l-2.688,0.753l-2.99,4.521L528.466,468.135L528.466,468.135z"
        />
        <path
          id="af"
          d="M545.85,435.383l1.374,10.771l3.423,0.752l0.32,1.937l-2.455,2.049l4.573,3.691l8.885-3.198l0.709-3.786l5.593-3.491l2.145-8.091l1.599-1.722l-1.659-2.887l5.412-3.347l-0.691-0.968l-2.498,0.155l-0.226,2.299l-3.354-0.033l-0.062-3.068l-1.079-1.288l-1.815,1.649l0.052,1.515l-2.739,1.036l-5.059-0.319l-6.568,6.881L545.85,435.383L545.85,435.383z"
        />
        <path
          id="am"
          d="M507.47,420.549l4.149,5.411l-1.218,1.427l-2.939-0.51l-3.646-3.268l0.196-2.146L507.47,420.549L507.47,420.549z"
        />
        <path
          id="az"
          d="M508.931,418.674l-0.873,1.486l4.071,5.342l1.418-0.458l2.334,2.446l1.011-4.287l2.533,0.406l-0.104-1.229l-4.165-3.646l-0.795,2.143L508.931,418.674L508.931,418.674z"
        />
        <path
          id="bd"
          d="M616.256,457.908l-1.134,2.049l2.938,5.584l0.087,4.357l0.535,1.166l3.449,0.061l1.953-1.875l1.418,0.855l0.285,2.652l1.133-0.708l0.069-3.389l-0.951-0.112l-0.596-2.879l-2.403-0.086l-0.596-1.6l1.469-1.962l0.024-0.97h-4.269L616.256,457.908L616.256,457.908z"
        />
        <path
          id="bn"
          d="M689.038,515.08l-2.489,3.018l2.04,0.641l1.149-1.608L689.038,515.08L689.038,515.08z"
        />
        <path
          id="bt"
          d="M616.108,453.561l1.34,1.833l4.528,0.034l-0.458-2.507L616.108,453.561L616.108,453.561z"
        />
        <g id="cn">
          <path
            className="mainland"
            d="M594.498,386.128l-2.99,7.521l-4.124-0.217l-4.349,9.518l3.691,4.701l-7.606,10.504l-3.907-0.658l-2.611,3.285l0.648,1.971l3.043,0.217l1.521,3.5l3.044,0.658l9.344,12.04v6.129l4.563,2.844l4.996-0.873l6.303,3.719l7.605,2.187l3.691-0.439l4.132-0.441l8.687-5.688l2.828,0.44l1.08,2.567l2.396,0.718l3.26,4.813l-2.17,4.814l1.306,3.285l3.69,1.312l0.647,3.942l4.35,0.439l0.647-1.971l6.302-3.285l3.907,0.217l4.563,5.03l3.043-1.312l1.954,0.216l0.873,2.412l1.521,0.216l2.169-3.06l8.688-3.285l7.823-9.413l2.61-8.974l-0.217-5.912l-3.259-0.656l1.953-2.188l-0.434-3.501l-8.255-8.314v-4.157l2.386-3.062l2.388-1.098l0.216-2.412h-6.085l-1.089,3.285l-2.828-0.656l-3.475-3.718l2.17-5.688l3.043-3.285l2.827,0.217l-0.434,5.031l1.521,1.313l3.691-3.717l1.306-0.216l-0.433-2.844l3.476-4.158l2.61,0.216l1.521-4.813l1.781-0.942l0.182-3l-1.729-1.815l-0.147-4.736l3.329-0.217l-0.216-12.214l-2.334,1.4L694.267,377l-3.897-0.009l-11.298-6.354l-8.16-9.837l-8.281-0.086l-2.107,1.833l2.68,6.137l-0.935,5.758l-3.335,1.383l-1.876-0.147l-0.139,5.696l1.954,0.441l3.476-1.53l4.563,2.187v2.188l-3.26,0.216l-2.611,5.688l-2.386,0.215l-8.472,11.16l-8.902,3.941l-6.086,0.441l-4.124-2.844l-5.869,3.068l-6.302-1.971l-1.521-4.158l-10.642-0.657l-5.646-9.188h-2.386l-1.92-4.262L594.498,386.128z"
          />
          <path d="M671.802,472.655l-2.064,0.579l-1.487,1.833l1.236,2.411l1.814,0.163l2.066-1.832l0.492-2.411L671.802,472.655L671.802,472.655z" />
        </g>
        <path
          id="cy"
          d="M484.555,437.794l1.062,0.771l-3.294,3.119l-1.573-0.052l-1.167-0.821l0.156-1.529l2.386-0.155L484.555,437.794L484.555,437.794z"
        />
        <path
          id="ge"
          d="M495.144,415.596l2.827,3.691l3.527,1.625l2.169-0.01l3.726-1.01l0.935-1.461l-11.021-4.123L495.144,415.596L495.144,415.596z"
        />
        <g id="id">
          <path d="M639.517,513.628l-0.241,1.971l5.869,9.862h1.711l12.23,20.461l4.894,0.492l2.445-7.148l-3.916-2.464l-0.734-3.941L639.517,513.628L639.517,513.628z" />
          <path d="M697.475,540.891l1.954,2.396l-1.271,3.596v0.684h2.887l1.021-8.989l0.934,0.26l1.694,8.212l1.615,0.434l1.53-3.512l-1.53-5.308l-1.271-2.31l3.993-2.911l-0.935-1.288l-3.819,2.48h-1.021l-1.866-2.74l0.597-1.201l3.146-1.539l4.754,1.453l1.444-0.089l3.568-3.335l-1.442-1.451l-3.312,2.565h-2.127l-3.224-1.538l-2.29,0.086l-2.55,4.106l-1.616,7.105L697.475,540.891L697.475,540.891z" />
          <path d="M718.791,524.805l-1.616,3.935l2.549,3.337h0.849l1.105-2.223l0.597-0.77l-1.105-1.201l-1.617-0.597L718.791,524.805L718.791,524.805z" />
          <path d="M723.805,537.729l-3.482,0.77l-1.021,1.115l0.847,1.453l2.291-0.855l1.442-0.855l2.126,1.712l0.935-0.771l-1.693-2.057L723.805,537.729L723.805,537.729z" />
          <path d="M666.045,548.854l-2.377,1.625l0.51,1.364l7.564,1.712l3.82,0.684l1.615,1.712l4.331,0.345l2.04,1.711l1.867-0.432l1.702-1.539l-3.146-1.452l-2.715-2.308l-7.053-1.713L666.045,548.854L666.045,548.854z" />
          <path d="M690.768,556.295l-1.865,1.029l1.104,1.201l2.715-1.027L690.768,556.295L690.768,556.295z" />
          <path d="M693.991,555.526l0.338,1.625l1.954,0.51l0.761-0.942l-0.848-1.288L693.991,555.526L693.991,555.526z" />
          <path d="M698.668,559.805l-2.377,0.347l2.126,1.798h1.694L698.668,559.805L698.668,559.805z" />
          <path d="M699.342,556.979l-0.511,1.027l3.821,0.596l2.974-1.711l-1.694-0.511l-2.715,0.771l-1.021-0.856L699.342,556.979L699.342,556.979z" />
          <path d="M711.833,557.583l-4.416,3.683l0.423,0.942l1.866-0.345l2.205-2.059l4.331-0.597l-0.848-1.452L711.833,557.583L711.833,557.583z" />
          <path d="M734.126,532.446l-3.604,0.406l-2.315,1.693l0.959,1.938l3.925,0.726v0.727l-2.48,2.015l1.201,4.192l1.201,0.078l1.037-4.115h1.919l0.806,4.027l9.361,7.746l0.241,6.051l3.198,3.467l1.442-0.077l0.319-21.369l-5.438-3.785l-5.125,3.467l-1.843,1.132l-3.043-1.937l-0.078-6.128L734.126,532.446L734.126,532.446z" />
          <path d="M690.689,519.532l-1.997,7.503l-10.831,3.656l-3.241-3.804l-1.573,0.433l2.939,11.34l4.398,0.493l5.869,2.222v2.222l2.688-0.493l3.916-5.42v-4.435l2.204-4.435l2.445,0.491l-2.938-6.163l-0.449-3.968L690.689,519.532L690.689,519.532z" />
        </g>
        <path
          id="il"
          d="M486.378,444.899l-1.365,4.348l1.771,5.213l2.031-7.616v-1.633L486.378,444.899L486.378,444.899z"
        />
        <path
          id="in"
          d="M595,509.688l3.958-1.938l2.352-8.505l-0.104-10.441l13.468-14.54v-3.447l2.774-1.081l-0.104-3.984l-2.991-5.817l1.712-3.121l3.742,3.449l4.808,0.216v1.938l-1.495,1.616l0.318,0.863l2.567,0.104l0.536,2.904h0.752l1.928-3.449l0.958-9.042l3.207-2.265l0.104-3.12l-1.279-2.481l-2.031-0.104l-7.951,5.256l0.5,3.38l-5.584-0.019l-1.97-2.41l-1.072,0.138l0.363,3.354l-12.075-0.863l-7.485-3.337l-0.397-4.106l-4.988-3.094l-0.06-6.371l-3.423-3.916l-7.867,0.752l0.855,3.424l3.854,3.12l-6.665,13.641l-4.46,0.337l-0.734,1.644l4.392,4.062l-0.216,4.105l-4.486-0.069l-0.484,2.04l3.727-0.164l0.104,1.616l-2.671,1.4l1.711,3.232l3.312,1.08l2.031-1.504l0.959-2.688l1.177-0.535l1.392,1.398l-0.424,3.449l-0.96,1.617l0.217,2.8L595,509.688L595,509.688z"
        />
        <path
          id="iq"
          d="M502.793,433.637l-1.348,6.664l-5.585,4.65l0.354,2.195l5.455,0.371l8.688,7.07l4.857-0.138l0.13-1.634l1.78-1.91l2.49,1.409l0.329-0.312l-4.815-6.405l-2.282-0.139l-3.033-3.898l0.604-2.868l0.926-0.121l0.319-1.271l-4.132-4.348L502.793,433.637L502.793,433.637z"
        />
        <path
          id="ir"
          d="M507.409,427.516l-1.057,1.098l0.104,1.738l1.314,1.842l4.658,5.101l-0.709,2.04h-0.812l-0.406,2.04l2.637,3.371l2.43,0.207l4.865,6.732l2.732,0.208l2.126,1.529l0.104,3.062l8.411,4.9h3.139l1.927-1.634l2.43-0.104l1.418,3.268l9.085,1.262l0.27-3.337l3.007-1.089l0.139-1.193l-2.395-3.268l-5.334-4.287l2.801-2.55l-0.198-1.124l-3.511-0.544l-1.486-11.843l-0.173-2.723l-9.518-3.641l-4.218,0.951l-2.36,2.896l-2.092-0.139l-0.604,0.511l-4.66-0.303l-5.878-4.288l-2.188-2.394l-1.003,0.24l-1.808,2.066L507.409,427.516L507.409,427.516z"
        />
        <path
          id="jo"
          d="M489.473,447.251l-2.126,7.416l-0.096,1.133h3.346l3.743-3.303l0.094-1.253l-1.529-1.564l2.739-2.272l-0.396-2.109l-0.752,0.173l-2.282,1.635L489.473,447.251L489.473,447.251z"
        />
        <g id="jp">
          <path d="M709.317,426.193l-1.41,1.418l0.579,1.996l1.236,0.086l0.83,4.332l0.993,1.08l1.738-1.582l0.151-4.773l-2-2.125L709.317,426.193L709.317,426.193z" />
          <path d="M716.688,422.188l-2.659,2.156l-0.591,2.719l1.812,1.25l2.625-2.75l0.37-3.062L716.688,422.188z" />
          <path d="M713.613,418.033l-4.219,4.832v2.322l2.604-0.312l4.085-3.592l2.731-0.502l0.663,0.779l0.015,2.377l0.688,1.25h1.255l1.763-2.158l0.743-2.836l3.552-0.086l3.476-4.166l-1.814-6.916l-0.83-3.664l1.815-1.496l-4.133-6.241l-0.944-0.744l-1.875,0.744l-0.481,2.584v2.083l0.994,1.167l0.328,5.498l-2.56,3.164l-1.485-0.917l-1.159,2.584l-0.251,2.412l0.909,1.418l-0.579,1.08l-1.902-1.582h-1.322l-1.157,0.666L713.613,418.033L713.613,418.033z" />
          <path d="M720.729,380.396l-1.321,1.168l0.665,2.498l1.158,1.166l-0.086,3.83l-1.487,0.578l-1.158,2.584l3.388,4.659l2.23-0.752l0.415-1.167l-2.396-2.161l1.487-1.919l1.572,0.25l3.43,2.305l0.37-2.584l1.63-2.979l2.281-2.312l-2.469-1.125l-0.944-1.801l-1.236,0.83l-1.071,1.331l-2.316-0.501l-2.396-1.582L720.729,380.396L720.729,380.396z" />
          <path d="M733.201,377.812l-2.317,3.25l0.164,1.582l1.158-0.502l2.723-3.414L733.201,377.812L733.201,377.812z" />
          <path d="M736.261,373.066l-0.829,2.248l0.086,1.496l1.409-0.918l1.322-2.662v-0.994L736.261,373.066L736.261,373.066z" />
        </g>
        <path
          id="kg"
          d="M565.463,411.316l-0.268,2.188l0.216,1.35l7.521,2.523l-6.604,2.662l-0.751-0.623l-1.427,0.917l0.068,0.501l0.761,0.346l4.635,0.121l2.351-0.709l3.018-3.803l3.776,0.656l4.557-6.311l-12.188-1.66l-1.686,4.088l-2.127-2.281L565.463,411.316L565.463,411.316z"
        />
        <path
          id="kh"
          d="M655.076,497.982l3.535,3.776l6.576-4.875l0.579-7.692l-3.396,2.343l-1.764-0.985l-2.396-0.32l-1.341-0.941l-0.648,0.035l-1.754,2.878l0.285,1.332l1.781,0.994l-0.216,2.705L655.076,497.982L655.076,497.982z"
        />
        <path
          id="kp"
          d="M687.751,407.047l1.59,0.666l0.484,5.566l3.155,0.183l2.974-3.483l-1.029-0.916l0.121-3.734l2.731-3.303l-1.392-2.506l0.908-1.039l0.501-2.592l-1.582-0.719l-1.35,0.684l-1.668,5.064l-2.697-0.232l-3.12,3.682L687.751,407.047L687.751,407.047z"
        />
        <path
          id="kr"
          d="M696.446,410.443l5.342,4.356l0.909,4.22l-0.183,2.264l-2.61,2.939l-2.248,0.12l-2.551-5.506l-0.968-2.629l1.028-0.795l-0.242-1.099l-1.271-0.569L696.446,410.443L696.446,410.443z"
        />
        <path
          id="kw"
          d="M519.2,452.774l-1.945-1.056l-1.349,1.356l0.146,2.715l3.139,1.201L519.2,452.774L519.2,452.774z"
        />
        <path
          id="kz"
          d="M513.495,402.163l3.544-1.513l3.959-0.139l0.276,6.051h-2.317l-1.772,2.888l2.317,3.847l3.414,1.928l0.311,2.205l1.255-0.416l1.157-1.375l1.91,0.416l0.96,1.928h2.455v-2.473l-1.504-4.4l-0.684-3.569l4.364-1.929l5.869,0.959l3.684,3.709l8.323-0.821l4.644,6.597l5.455,0.274l1.504-2.472l1.91-0.416l0.274-2.748l2.862-0.139l1.503,1.789l1.505-3.57l12.957,1.789l2.179-2.887l-3.683-4.537l4.91-10.719l3.958,0.275l2.731-6.594l-5.455-0.554l-3.138-3.024l-8.644,1.002l-11.134-10.762l-3.926,3.482l-11.902-5.402l-14.601,7.148l-0.405,5.083l3.413,3.985l-6.655,3.76l-8.636-0.19l-1.807-2.653l-6.769-0.373l-6.414,4.123l-0.14,5.638L513.495,402.163L513.495,402.163z"
        />
        <path
          id="la"
          d="M650.745,466.397l-2.092,1.062l-1.737,5.065l2.904,3.699l-0.485,4.09l0.485,0.196l4.832-2.342l6.482,7.243l-0.157,4.563l1.41,0.762l3.482-2.827l-0.285-2.238l-10.053-9.552l0.095-1.461l1.254-0.873l-0.874-2.438l-4.158-0.684L650.745,466.397L650.745,466.397z"
        />
        <path
          id="lb"
          d="M487.139,440.041l0.053,1.686l-0.708,2.56l2.438,0.208l0.156-3.631L487.139,440.041L487.139,440.041z"
        />
        <path
          id="lk"
          d="M603.264,505.399l0.217,2.351l0.216,1.712l-1.271,0.216l0.64,3.848l1.909,1.07l2.966-1.711l-0.847-4.054l0.216-1.495l-2.756-2.559L603.264,505.399L603.264,505.399z"
        />
        <path
          id="mm"
          d="M645.533,501.596l-2.396-3.838l1.737-2.438l-1.642-3.018l-1.548-0.294l-0.294-5.064l-2.316-4.486l-0.675,1.071l-1.547,2.628l-1.937,0.294l-0.968-1.271l-0.484-3.414l-1.453-2.73l-5.913-5.576l1.453-0.959l0.27-4.037l2.16-3.631l0.935-9.032l3.129-2.136l0.103-3.293l1.877,0.622l2.956,4.279l-2.194,4.701l1.479,3.691l3.655,1.435l0.666,4.021l4.91,0.761l-1.357,2.343l-6.188,2.438l-0.674,3.993l4.547,5.844l0.189,3.12l-1.062,1.072l0.094,0.977l3.389,4.971l0.096,5.16L645.533,501.596L645.533,501.596z"
        />
        <path
          id="mn"
          d="M597.438,386.215l5.03-6.673l6.043,2.792l4.105,1.098l5.03-4.615l-3.414-2.517l2.248-3.172l6.707,2.369l2.325,3.812l4.199,0.112l2.196-1.634l4.521-0.182l0.985,1.678l7.512,0.38l4.754-4.849l6.578,0.69l-0.38,6.604l2.879,0.656l3.535-1.606l3.743,1.85l-0.088,0.935l-2.714,0.078l-2.827,5.93l-2.195,0.216l-8.54,11.16l-8.723,3.847l-5.455,0.424l-4.529-2.923l-5.791,3.095l-5.705-1.771l-1.617-4.141l-10.805-0.762l-5.532-9.377l-2.688-0.174L597.438,386.215L597.438,386.215z"
        />
        <g id="mv">
          <path d="M582.396,516.386l0.26,2.256l1.442,0.527l0.26-1.989L582.396,516.386L582.396,516.386z" />
          <path d="M584.238,521.156l-0.13,2.784l1.055,0.525l0.925-1.856L584.238,521.156L584.238,521.156z" />
          <path d="M584.506,526.595l-0.925,0.925l1.056,0.925l1.313-0.925L584.506,526.595L584.506,526.595z" />
        </g>
        <g id="my">
          <path
            className="mainland"
            d="M648.359,511.796l1.736,3.898l0.391,5.064l2.324,3.604l5.096,3.083l1-0.791l1.464-0.288l-0.212-1.91l-1.841-4.478l-2.697-5.731l-0.227,1.003l-3.25-0.146l-2.334-3.354L648.359,511.796L648.359,511.796z"
          />
          <path d="M675.527,526.896l2.61,3.018l10.012-3.467l1.979-7.643l4.46-0.319l4.08-2.956l-5.29-3.854l-1.211-2.119l-2.61,4.815l0.959,2.766l-1.591,2.31l-2.999-0.771l-7.27,5.333l0.188,3.086L675.527,526.896L675.527,526.896z" />
        </g>
        <path
          id="np"
          d="M595.182,448.789l0.397,3.691l6.983,3.162l11.193,0.83l-0.423-2.705l-7.478-2.058l-6.346-3.777L595.182,448.789L595.182,448.789z"
        />
        <path
          id="om"
          d="M532.244,481.879l6.388-3.683l1.133-5.402l-1.399-0.804l0.579-5.792l1.219-0.709l1.306,2.049l7.771,4.062v2.258l-9.413,13.854l-4.331,0.147L532.244,481.879L532.244,481.879z"
        />
        <g id="ph">
          <path d="M697.337,496.306l-0.743,1.418l-0.414,1.746l-4.132,5.246l0.25,1.081l1.737-0.251l5.368-5.999L697.337,496.306L697.337,496.306z" />
          <path d="M704.027,494.309l-0.088,4.331l1.573,1.582l0.578,3.077l1.574,0.337l0.742-1.919l-1.236-0.916l-0.328-5.411L704.027,494.309L704.027,494.309z" />
          <path d="M708.496,495.978l-0.087,3.829l0.908,1.495l1.571-1.832l-0.414-3.328L708.496,495.978L708.496,495.978z" />
          <path d="M709.481,492.641l1.572,2.083l0.743,1.997h1.409l-0.25-3.415l-1.573-1.08L709.481,492.641L709.481,492.641z" />
          <path d="M712.542,500.472l0.328,2.498l-2.896,2.334l-2.396,0.251l-2.56,2.749l0.087,1.252l2.396-0.751l1.651-1.08l1.408,3.578l2.48,1.747l0.994-0.338l0.907-1.08l-1.979-1.997l1.159-0.916l1.322,1.08l0.906-1.495l-0.906-1.833l-0.164-4.08L712.542,500.472L712.542,500.472z" />
          <path d="M699.074,475.076l-2.23,1.581l-0.25,4.997l3.477,6.742l1.158,0.915l1.485-1.003l2.56,0.415l0.492,2.248l1.901,0.164l0.908-1.245l-1.158-1.582l-1.409-1.331l-2.974-0.327l-1.573-2.585l1.816-2.749l0.163-2.411l-1.236-3.077L699.074,475.076L699.074,475.076z" />
          <path d="M700.232,489.979l0.657,2.335l1.158,0.752l0.83-1.081l-1.323-1.832L700.232,489.979L700.232,489.979z" />
        </g>
        <path
          id="pk"
          d="M553.638,455.082l2.248,3.337l-0.216,1.72l-2.991,1.186l-0.217,2.801h3.424l1.175-0.969h6.519l5.878,5.17l0.752-2.481h4.383l0.104-3.12l-4.486-4.305l0.96-2.369l4.598-0.318l6.199-12.924l-3.425-2.688l-1.278-4.521l8.333-0.752l-4.917-7l-2.62-0.709l-1.07,1.297l-0.805,0.061l-4.919,3.12l1.608,2.696l-1.815,1.937l-2.249,8.29l-5.558,3.553l-0.752,3.882L553.638,455.082L553.638,455.082z"
        />
        <path
          id="qa"
          d="M527.273,463.018l-0.449,3.467l1.331,1.012l1.209-0.112l0.45-4.365l-1.047-0.752L527.273,463.018L527.273,463.018z"
        />
        <path
          id="sa"
          d="M519.812,458.021l6.061,8.443l1.953,1.558l0.874,3.785l9.327,0.734l1.055,0.554l-1.046,4.667l-6.129,3.613l-8.964,2.715l-4.78,4.668l-5.679-3.312l-3.439,3.009l-4.791-7.823l-3.284-1.504l-1.192-1.807v-3.916l-11.954-14.452l-0.451-2.561h3.44l4.184-3.611l0.146-1.808l-1.192-1.201l2.395-1.953l5.084,0.303l8.669,7.226l5.117-0.232l0.329,1.263L519.812,458.021L519.812,458.021z"
        />
        <path
          id="sg"
          d="M658.314,527.705l0.686,0.389l1.548-0.126l-0.13-1.167L659.156,527L658.314,527.705z"
        />
        <path
          id="sy"
          d="M487.545,437.18l-0.302,2.196l2.437,1.021l-0.104,6.086l2.438-0.053l2.438-1.842l0.916-0.155l5.532-4.398l1.114-6.39l-11.056,1.125l-1.167,2.559L487.545,437.18L487.545,437.18z"
        />
        <path
          id="th"
          d="M646.043,472.915l2.8,3.604v4.384l0.968,0.482l4.452-2.144l0.873,0.294l5.316,6.138l-0.19,4.192l-1.737-0.294l-1.548-0.979l-1.158,0.097l-2.031,3.404l0.39,1.851l1.642,0.873l-0.095,2.049l-1.157,0.588l-3.97-2.731v-2.438l-1.642-0.095l-0.674,1.07l-0.347,10.909l2.567,4.686l4.547,4.383l-0.188,1.271l-2.423-0.094l-2.221-3.311h-2.325l-2.902-2.345l-0.874-2.437l1.254-2.049l0.432-1.851l1.366-2.421l-0.061-5.565l-3.337-4.823l-0.139-0.588l1.081-1.089l-0.251-3.83l-4.441-5.627l0.519-3.241L646.043,472.915L646.043,472.915z"
        />
        <path
          id="tj"
          d="M559.74,422.234l3.552-4.408h1.34l0.467,0.984l-1.642,1.192v0.985l1.081,0.777l5.195,0.312l1.693-0.727l0.77,0.154l0.52,1.66l3.085,0.312l1.548,3.267l-0.467,0.985l-0.614,0.053l-0.612-1.245l-1.341-0.104l-2.315,0.312l-0.156,2.18l-2.316-0.155l0.104-2.75l-1.694-1.658l-2.575,2.125l0.053,1.4l-2.265,0.778h-1.341l0.104-4.824L559.74,422.234L559.74,422.234z"
        />
        <path
          id="tm"
          d="M528.328,418.561l-0.535,2.273h-3.588v3.078l3.854,2.541l-1.191,3.482v1.608l1.599,0.269l2.127-2.811l4.789-1.07l10.234,3.881l0.129,2.809l5.714,0.536l6.38-6.698l-0.796-2.145l-4.253-0.935l-11.964-7.771l-0.535-2.81h-4.521l-1.997,3.753h-1.997L528.328,418.561L528.328,418.561z"
        />
        <path
          id="tr"
          d="M472.812,421.906l-2.305-1.426l-1.271-1.013l-2.138,0.916l0,0l-1.477,3.74l2.219-0.5l1.562-1.188l3.438,0.938l-1.946,1.877L465.719,425l-1.91,2.093v1.021l1.22,1.021v1.123l-0.511,1.332l0.511,1.123l1.625-0.812l1.625,1.737l-0.406,1.228l-0.604,0.82l0.907,1.021l4.461,0.916l3.139-1.331v-1.937l1.521,0.303l3.648,2.144l3.948-0.614l1.721-1.633l1.114,0.406v1.841h1.521l1.313-2.55l11.549-1.229l5.04-0.613l-1.331-1.746l-0.025-2.359l1.011-1.21l-3.682-2.956l0.197-2.551h-2.022l-3.354-1.643l0,0l-1.929,2.041l-7.088-0.209l-4.253-2.549l-4.082,0.366l-4.544,2.729L472.812,421.906z"
        />
        <path
          id="tw"
          d="M695.686,453.76l-3.06,2.334l-0.163,4.494l2.646,3.078l0.656-0.58L695.686,453.76L695.686,453.76z"
        />
        <path
          id="uz"
          d="M558.643,428.477l2.662,0.138v-4.556l-2.522-1.47l4.253-5.358h1.729l1.729,2.015l4.521-1.738l-6.25-2.144l-0.242-1.297l-1.485,0.363l-1.461,2.541l-6.302-0.207l-4.625-6.543l-8.125,0.803l-3.872-3.838l-5.358-0.906l-3.891,1.582l2.257,7.502l0.024,2.524l1.643,0.035l2.014-3.839l5.359,0.068l0.796,2.947l11.487,7.625l4.442,1.021L558.643,428.477L558.643,428.477z"
        />
        <path
          id="vn"
          d="M659.035,502.287l1.027,1.616l0.19,1.851l2.705,0.294l3.286-4.383l3.095-0.873l1.643-4.478l-0.771-7.209l-3.189-4.384l-3.362-2.688l-4.278-7.349l3.068-5.135l-4.393-5.039l-3.517-0.154l-3.164,1.702l0.942,4.071l4.219,0.743l1.133,3.138l-1.487,0.969l0.096,0.777l9.896,9.683l0.388,2.844l-0.595,8.989L659.035,502.287L659.035,502.287z"
        />
        <g id="ye">
          <path
            className="mainland"
            d="M509.432,489.131l1.244,3.7v3.613l2.991,2.714l21.074-8.584l0.198-2.359l-3.381-6.067l-8.479,2.706l-4.866,4.787l-5.645-3.336L509.432,489.131L509.432,489.131z"
          />
          <path d="M533.315,498.138l1.842,2.059l2.489-1.504l0.897-0.304l-1.141-1.105l-2.188,0.647L533.315,498.138L533.315,498.138z" />
        </g>
      </g>
    </svg>
  );
};
